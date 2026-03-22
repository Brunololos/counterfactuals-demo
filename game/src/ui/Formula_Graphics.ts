import { Rules } from "../game/Game_Rules";
import Base_Scene from "../util/Base_Scene";
import { Atom, Bottom, Cf_Might, Cf_Would, Conjunction, Disjunction, Formula, Necessity, Negation, Possibility, Top } from "../game/Cf_Logic";
import { PLAYER_COLOR, COPILOT_COLOR, duplicate_texture, dye_texture, overlay_texture, fill_texture, Game_Graphics_Mode } from "../util/UI_Utils";
import { Formula_Animations } from "./animations/Formula_Animations";
import { cloneDeep } from "lodash";

// export const NEG_WIDTH = 30; // 60; // TODO: if logic symbols: 30;
// export const DISJ_WIDTH = 30; // TODO: if logic symbols: 60;

export const NEG_META_WIDTH = 60;
export const NEG_LOGIC_WIDTH = 30;
export const DISJ_META_WIDTH = 30;
export const DISJ_LOGIC_WIDTH = 30; // 60;
export const CF_META_WIDTH = 60;
export const CF_LOGIC_WIDTH = 90;

export const ICON_WIDTH = 60;
export const BRACKET_WIDTH = 10;

const NUM_RECOLORS = 8;

export class Formula_Graphics extends Phaser.GameObjects.Container {
    private formula: Formula_Graphics_Element;
    private atoms: string[];
    private embedding_depth: integer = 0;

    private metaphor_mode: string;
    private curr_formula: Formula;
    private next_formula?: Formula;

    // reference to animation to access & recreate when swapping out sprites for metaphor toggle
    private animation_timeline?: Phaser.Tweens.Timeline;
    private animated_transition?: [Game_Graphics_Mode, Game_Graphics_Mode];
    private animated_move?: Rules;

    constructor(scene: Base_Scene, x: number, y: number, formula: Formula, atoms: string[], metaphor_mode: string, embedding_depth: integer = 0) {
        super(scene, x, y);

        this.metaphor_mode = metaphor_mode;
        this.curr_formula = formula;
        this.atoms = cloneDeep(atoms);
        this.embedding_depth = embedding_depth;
        this.formula = Formula_Graphics_Element.parse(scene, formula, 0, 0, this.atoms, metaphor_mode);
        this.formula.add_to_container(this);
    }

    static load_sprites(scene: Phaser.Scene) {
        if(scene.textures.getTextureKeys().includes("false")) { return; }
        // METAPHOR SYMBOLS
        scene.load.image("loss", "assets/False.png");
        scene.load.image("false_metaphor", "assets/Tank_Empty.png");
        scene.load.image("win", "assets/True.png");
        scene.load.image("true_metaphor", "assets/Flag.png");

        scene.load.image("atom_metaphor", "assets/Atom.png");
        scene.load.image("glow_metaphor", "assets/Glow.png");
        // scene.load.image("negation_metaphor", "assets/Negation.png");
        scene.load.image("negation_metaphor_player", "assets/Shift_Switch_Player.png");
        scene.load.image("negation_metaphor_copilot", "assets/Shift_Switch_Copilot.png");
        scene.load.image("negation_metaphor_arrows", "assets/Shift_Switch_Arrows.png");

        scene.load.image("possibility_metaphor", "assets/Possibility_Basic.png");
        scene.load.image("necessity_metaphor", "assets/Necessity_Basic.png");
        
        scene.load.image("disjunction_metaphor", "assets/OR.png");
        scene.load.image("conjunction_metaphor", "assets/AND.png");
        scene.load.image("cf_would_metaphor", "assets/Cf_Would.png");
        scene.load.image("cf_might_metaphor", "assets/Cf_Might.png");

        // LOGIC SYMBOLS
        scene.load.image("false_logic", "assets/Bottom_From_Logic.png");
        scene.load.image("true_logic", "assets/Top_From_Logic.png");
        scene.load.image("negation_logic", "assets/Negation_From_Logic.png");
        scene.load.image("disjunction_logic", "assets/Disjunction_From_Logic.png");
        scene.load.image("conjunction_logic", "assets/Conjunction_From_Logic.png");
        scene.load.image("possibility_logic", "assets/Possibility_From_Logic.png");
        scene.load.image("necessity_logic", "assets/Necessity_From_Logic.png");
        scene.load.image("cf_would_logic", "assets/Cf_Would_From_Logic.png");
        scene.load.image("cf_might_logic", "assets/Cf_Might_From_Logic.png");

        // BRACKETS
        /* scene.load.image("fill_open", "assets/Fill_Open.png");
        scene.load.image("fill_connect", "assets/Fill_Connect.png");
        scene.load.image("fill_closed", "assets/Fill_Closed.png"); */
        scene.load.image("fill_open", "assets/BO.png");
        scene.load.image("fill_connect", "assets/Empty_Icon.png");
        scene.load.image("fill_closed", "assets/BC.png");

    }

    static configure_sprites(scene: Phaser.Scene) {
        if(scene.textures.getTextureKeys().includes("fill_open_0")) { return; }
        //let atom_colors = [0xF5C92A, 0x27577F, 0xFF577F, 0x27571B, 0xD3402A]; // TODO: make colors pop more like 0xFF577F,
        let atom_colors = [0xFFCB42, 0x42855B, 0x533483, /* 0xFF577F */0xFF4842, 0xA2B5BB, 0x47B5FF/* , 0x84513D */, 0xFF42CA, 0x2766FA]; // TODO: Fix wrong atom color
        //let atom_colors = [0xFFCB42, 0x42855B, 0x533483, 0xA2B5BB, 0xFF8FB1, 0x47B5FF, 0x84513D];
        for(let i=0; i<NUM_RECOLORS; i++) {
            duplicate_texture(scene, "fill_open", "fill_open_"+(i).toString());
            duplicate_texture(scene, "fill_connect", "fill_connect_"+(i).toString());
            duplicate_texture(scene, "fill_closed", "fill_closed_"+(i).toString());

            duplicate_texture(scene, "atom_metaphor", "atom_"+(i).toString()+"_metaphor");
            dye_texture(scene, "atom_"+(i).toString()+"_metaphor", atom_colors[i]);

            // TODO: migrate to logic sprites
            duplicate_texture(scene, "atom_metaphor", "atom_"+(i).toString()+"_logic");
            dye_texture(scene, "atom_"+(i).toString()+"_logic", atom_colors[i]);
        }

        // Build Negation metaphor texture with dynamic coloring
        duplicate_texture(scene, "negation_metaphor_player", "negation_metaphor_player_colored");
        duplicate_texture(scene, "negation_metaphor_copilot", "negation_metaphor_copilot_colored");
        duplicate_texture(scene, "negation_metaphor_arrows", "negation_metaphor");
        dye_texture(scene, "negation_metaphor_player_colored", PLAYER_COLOR);
        dye_texture(scene, "negation_metaphor_copilot_colored", COPILOT_COLOR);
        overlay_texture(scene, "negation_metaphor", "negation_metaphor_player_colored");
        overlay_texture(scene, "negation_metaphor", "negation_metaphor_copilot_colored");
    }


    animate_transition(transition: [Game_Graphics_Mode, Game_Graphics_Mode], start_from: number=0): number {
        let timeline = this.scene.tweens.createTimeline();
        let anim_time = Formula_Animations.fill_transition_animation_timeline(timeline, transition, this);
        timeline.time = start_from;
        timeline.play(false);

        this.animation_timeline = timeline;
        this.animated_transition = transition;
        return anim_time;
    }

    animate(formula: Formula, rule: Rules, start_from: number=0): number {
        this.next_formula = formula; 
        if(rule == Rules.Defender_Victory || rule == Rules.Attacker_Victory) { this.next_formula = undefined; }
        //if([Rules.Negated_Left_OR, Rules.Negated_Right_OR, Rules.Attacker_Vacuous_Truth_Claim].includes(rule)) { this.embedding_depth++; } // TODO: doesn't matter rn fix later
        return this.start_animation(rule, start_from);
    }

    end_animation() {
        if(this.next_formula != undefined) {
            this.animation_timeline = undefined;
            this.animated_move = undefined;
            this.removeAll(true);
            this.formula = Formula_Graphics_Element.parse((this.scene as Base_Scene), this.next_formula, 0, 0, this.atoms, this.metaphor_mode, this.embedding_depth);
            this.formula.add_to_container(this);
            this.curr_formula = this.next_formula;
            this.next_formula = undefined;
        }
    }

    /**
     * Add another formula until the main formula is re-set
     * @returns temporarily added Formula_Graphics_Element
     */
    add_temporary_formula(formula: string): Formula_Graphics_Element {
        let temporary = Formula_Graphics_Element.parse((this.scene as Base_Scene), Formula.parse(formula), 0, 0, this.atoms, this.metaphor_mode, this.embedding_depth);
        temporary.add_to_container(this);
        return temporary;
    }

    set_atoms(atoms: string[]) {
        this.atoms = atoms;
    }

    set_formula(formula: Formula) {
        this.removeAll(true);
        this.next_formula = undefined;
        this.curr_formula = formula;
        this.formula = Formula_Graphics_Element.parse((this.scene as Base_Scene), formula, 0, 0, this.atoms, this.metaphor_mode, this.embedding_depth);
        this.formula.add_to_container(this);
    }

    set_embedding_depth(depth: integer) {
        this.embedding_depth = depth;
    }

    start_animation(rule: Rules, start_from: number = 0): number {
        let timeline = this.scene.tweens.createTimeline();
        let anim_time = Formula_Animations.fill_animation_timeline(timeline, rule, this);
        timeline.time = start_from;
        timeline.play(false);

        this.animation_timeline = timeline;
        this.animated_move = rule;
        return anim_time;
    }

    set_tint(color: number) {
        let children = this.getAll();
        for(let i=0; i<children.length; i++) {
            (children[i] as Phaser.GameObjects.Sprite).setTint(color);
        }
    }

    set_metaphor_mode(metaphor_mode: string) {
        this.metaphor_mode = metaphor_mode;
        // NOTE: this is a bit hacky, but we check, whether a win or loss formula element is
        // present and if so we don't update the visualization because it's the same. This has
        // to be done bc win & loss are only added as temporary formulas into the container without
        // any reference to them.
        for (var formula_element of this.list) {
            if (formula_element.texture.key == "win"
            ||  formula_element.texture.key == "loss") { return; }
        }
        let scale = this.formula.scaleX;

        this.removeAll(true);
        this.formula = Formula_Graphics_Element.parse(this.scene, this.curr_formula, 0, 0, this.atoms, metaphor_mode);
        this.formula.scale_recursive(scale);
        this.formula.add_to_container(this);

        // Handle animation
        if (this.animation_timeline === undefined) { return; }
        let current_time = this.animation_timeline.progress * this.animation_timeline.duration;
        this.animation_timeline.stop();
        this.animation_timeline.destroy();
        if (this.animated_move !== undefined) {
            this.animate(this.next_formula, this.animated_move, current_time);
        } else if (this.animated_transition !== undefined) {
            this.animate_transition(this.animated_transition, current_time);
        }
    }

    /**
     * Get the Formula_Graphics_Element tree root element
     * @returns Formula_Graphics_Element
     */
    get_formula(): Formula_Graphics_Element {
        return this.formula;
    }

    get_embedding_depth(): integer {
        return this.embedding_depth;
    }

    get_width(): number {
        return this.formula.get_width(this.metaphor_mode);
    }

    get_metaphor_mode(): string {
        return this.metaphor_mode;
    }

    static get_neg_width(metaphor_mode: string): number {
        return ((metaphor_mode == "metaphor") ? NEG_META_WIDTH : NEG_LOGIC_WIDTH);
    }

    static get_disj_width(metaphor_mode: string): number {
        return ((metaphor_mode == "metaphor") ? DISJ_META_WIDTH : DISJ_LOGIC_WIDTH);
    }

    static get_cf_width(metaphor_mode: string): number {
        return ((metaphor_mode == "metaphor") ? CF_META_WIDTH : CF_LOGIC_WIDTH);
    }
}

export abstract class Formula_Graphics_Element extends Phaser.GameObjects.Sprite {

    /**
     * Retrieve the subformula graphics reached by the passed path
     * @param path A string path to the subformula graphics to retrieve (l-travel to left child, r-travel to right child, example: "llrlrllrr")
     */
    abstract get_child(path: string): Formula_Graphics_Element;

    /**
     * Create a graphics object tree representation of a counterfactual formula
     * @param to_parse A Formula to be represented by graphics
     * @returns The root object of a tree of formula graphics element objects
     */
    static parse(scene: Base_Scene, to_parse: Formula, x: number, y: number, atoms: string[]=[], metaphor_mode: string="metaphor", embedded: number=0): Formula_Graphics_Element {
        let antecedent; let consequent; let subject1; let subject2; let subject;
        let DISJ_WIDTH = Formula_Graphics.get_disj_width(metaphor_mode);
        let CF_WIDTH = Formula_Graphics.get_cf_width(metaphor_mode);
        switch(true) {
            case to_parse instanceof Cf_Might:
                antecedent = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x, y, atoms, metaphor_mode, embedded+1);
                consequent = Formula_Graphics_Element.parse(scene, to_parse.get_child("r"), x, y, atoms, metaphor_mode, embedded+1);
                antecedent.offset(- CF_WIDTH/2 - consequent.get_width(metaphor_mode)/2);
                consequent.offset(+ CF_WIDTH/2 + antecedent.get_width(metaphor_mode)/2);
                return new Cf_Might_Graphics(scene, x + (antecedent.get_width(metaphor_mode) - consequent.get_width(metaphor_mode))/2, y, antecedent, consequent, metaphor_mode, embedded);
            case to_parse instanceof Cf_Would:
                antecedent = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x, y, atoms, metaphor_mode, embedded+1);
                consequent = Formula_Graphics_Element.parse(scene, to_parse.get_child("r"), x, y, atoms, metaphor_mode, embedded+1);
                antecedent.offset(- CF_WIDTH/2 - consequent.get_width(metaphor_mode)/2);
                consequent.offset(+ CF_WIDTH/2 + antecedent.get_width(metaphor_mode)/2);
                return new Cf_Would_Graphics(scene, x + (antecedent.get_width(metaphor_mode) - consequent.get_width(metaphor_mode))/2, y, antecedent, consequent, metaphor_mode, embedded);
            case to_parse instanceof Disjunction:
                subject1 = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x, y, atoms, metaphor_mode, embedded+1);
                subject2 = Formula_Graphics_Element.parse(scene, to_parse.get_child("r"), x, y, atoms, metaphor_mode, embedded+1);
                subject1.offset(- DISJ_WIDTH/2 - subject2.get_width(metaphor_mode)/2);
                subject2.offset(+ DISJ_WIDTH/2 + subject1.get_width(metaphor_mode)/2);
                return new Disjunction_Graphics(scene, x + (subject1.get_width(metaphor_mode) - subject2.get_width(metaphor_mode))/2, y, subject1, subject2, metaphor_mode, embedded);
            case to_parse instanceof Conjunction:
                subject1 = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x, y, atoms, metaphor_mode, embedded+1);
                subject2 = Formula_Graphics_Element.parse(scene, to_parse.get_child("r"), x, y, atoms, metaphor_mode, embedded+1);
                subject1.offset(- DISJ_WIDTH/2 - subject2.get_width(metaphor_mode)/2);
                subject2.offset(+ DISJ_WIDTH/2 + subject1.get_width(metaphor_mode)/2);
                return new Conjunction_Graphics(scene, x + (subject1.get_width(metaphor_mode) - subject2.get_width(metaphor_mode))/2, y, subject1, subject2, metaphor_mode, embedded);
            case to_parse instanceof Possibility:
                subject = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x + ICON_WIDTH/2, y, atoms, metaphor_mode, embedded);
                return new Possibility_Graphics(scene, x - subject.get_width(metaphor_mode)/2, y, subject, metaphor_mode);
            case to_parse instanceof Necessity:
                subject = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x + ICON_WIDTH/2, y, atoms, metaphor_mode, embedded);
                return new Necessity_Graphics(scene, x - subject.get_width(metaphor_mode)/2, y, subject, metaphor_mode);
            case to_parse instanceof Negation:
                let NEG_WIDTH = Formula_Graphics.get_neg_width(metaphor_mode);
                subject = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x + NEG_WIDTH/2, y, atoms, metaphor_mode, embedded);
                return new Negation_Graphics(scene, x - subject.get_width(metaphor_mode)/2 + ((subject instanceof Conjunction_Graphics || subject instanceof Disjunction_Graphics || subject instanceof Cf_Might_Graphics || subject instanceof Cf_Would_Graphics) ? + BRACKET_WIDTH/2 : 0), y, subject, metaphor_mode);
                // TODO: Fix random Bracket Offset for binary operators //In ..._Would_Target_Evaluation Animation set correct negation offset // rm offset in Formula creation
            case to_parse instanceof Atom:
                return new Atom_Graphics(scene, x, y, (to_parse as Atom).value, atoms, metaphor_mode);
            case to_parse instanceof Bottom:
                return new Bottom_Graphics(scene, x, y, metaphor_mode);
            case to_parse instanceof Top:
                return new Top_Graphics(scene, x, y, metaphor_mode);
            default:
                throw new Error("Cannot parse invalid formula");
        }
    };

    abstract offset(x: number): void;

    abstract scale_recursive(s: number): void;

    abstract set_depth(d: number): void;

    abstract get_width(metaphor_mode: string): number;

    abstract get_atoms(atoms: string[]): Formula_Graphics_Element[];

    abstract get_children(aux?: Formula_Graphics_Element[]): Formula_Graphics_Element[];
    
    abstract get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[];

    abstract add_to_container(container: Phaser.GameObjects.Container): void;

    static get_embedding_sprite_key(embedded: integer): string {
        return "_"+(embedded % NUM_RECOLORS).toString();
    }
}

/**
 * A class representation of the counterfactual might operator
 */
 export class Cf_Might_Graphics extends Formula_Graphics_Element {
    antecedent: Formula_Graphics_Element;
    consequent: Formula_Graphics_Element;
    brackets: Phaser.GameObjects.Sprite[] = [];

    /**
     * Create a counterfactual might between two formulas
     * @param antedecent Formula
     * @param consequent Formula
     */
    constructor(scene: Base_Scene, x: number, y: number, antedecent: Formula_Graphics_Element, consequent: Formula_Graphics_Element, metaphor_mode: string, embedded: integer) {
        super(scene, x, y, "cf_might_"+metaphor_mode);
        this.antecedent = antedecent;
        this.consequent = consequent;

        let w1 = this.antecedent.get_width(metaphor_mode);
        let w2 = this.consequent.get_width(metaphor_mode);
        let CF_WIDTH = Formula_Graphics.get_cf_width(metaphor_mode);

        if(embedded >= 0) {
            let suff = Formula_Graphics_Element.get_embedding_sprite_key(embedded);
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x - w1 + 30 - CF_WIDTH/2 - BRACKET_WIDTH, this.y, "fill_open"+suff).setDisplaySize(ICON_WIDTH, ICON_WIDTH));
            // NOTE: this inner computation is not correct anymore after adding + 30 - CF_WIDTH/2
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + (-w1 + w2)/2, this.y, "fill_connect"+suff).setDisplaySize(-ICON_WIDTH + w1 + w2 + BRACKET_WIDTH*2, ICON_WIDTH));//.setScale((-ICON_WIDTH + w1 + w2 + BRACKET_WIDTH*2)/ICON_WIDTH, 1));
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + w2 - 30 + CF_WIDTH/2 + BRACKET_WIDTH, this.y, "fill_closed"+suff).setDisplaySize(ICON_WIDTH, ICON_WIDTH));
        }
        this.setDisplaySize(CF_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.antecedent.get_child(path.slice(1, path.length));
            case 'r':
                return this.consequent.get_child(path.slice(1, path.length));
            default:
                throw new Error("path string may only contain the letters 'l' and 'r'");
        }
    }

    offset(x: number): void {
        this.setX(this.x + x);
        this.antecedent.offset(x);
        this.consequent.offset(x);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setX(this.brackets[i].x + x);
        }
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setX(this.brackets[i].x * s);
            //this.brackets[i].setScale(this.brackets[i].texture.key == "bracket_compact" ? this.brackets[i].scaleX * s : this.brackets[i].scaleX, this.brackets[i].scaleY * s);
            this.brackets[i].setScale(this.brackets[i].scaleX * s, this.brackets[i].scaleY * s);
        }
        this.antecedent.scale_recursive(s);
        this.consequent.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.antecedent.set_depth(d);
        this.consequent.set_depth(d);
    }

    get_width(metaphor_mode: string): number {
        let CF_WIDTH = Formula_Graphics.get_cf_width(metaphor_mode);
        return CF_WIDTH*this.scaleX + this.antecedent.get_width(metaphor_mode) + this.consequent.get_width(metaphor_mode) + 2*BRACKET_WIDTH*this.scaleX;
    }

    get_atoms(atoms: string[]): Formula_Graphics_Element[] {
        return this.antecedent.get_atoms(atoms).concat(this.consequent.get_atoms(atoms));
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux.concat([this.antecedent, this.consequent]).concat(this.antecedent.get_children()).concat(this.consequent.get_children());
    }

    get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[] {
        return recursive ? this.brackets.concat(this.antecedent.get_embedding(true)).concat(this.consequent.get_embedding(true)) : this.brackets;
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        for(let i=0; i<this.brackets.length; i++) {
            container.add(this.brackets[i]);
        }
        container.add(this);
        this.antecedent.add_to_container(container);
        this.consequent.add_to_container(container);
    }
}

/**
 * A class representation of the counterfactual would operator
 */
 export class Cf_Would_Graphics extends Formula_Graphics_Element {
    antecedent: Formula_Graphics_Element;
    consequent: Formula_Graphics_Element;
    brackets: Phaser.GameObjects.Sprite[] = [];

    /**
     * Create a counterfactual would between two formulas
     * @param antedecent Formula
     * @param consequent Formula
     */
    constructor(scene: Base_Scene, x: number, y: number, antedecent: Formula_Graphics_Element, consequent: Formula_Graphics_Element, metaphor_mode: string, embedded: integer) {
        super(scene, x, y, "cf_would_"+metaphor_mode);
        this.antecedent = antedecent;
        this.consequent = consequent;

        let w1 = this.antecedent.get_width(metaphor_mode);
        let w2 = this.consequent.get_width(metaphor_mode);
        let CF_WIDTH = Formula_Graphics.get_cf_width(metaphor_mode);

        if(embedded >= 0) {
            let suff = Formula_Graphics_Element.get_embedding_sprite_key(embedded);
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x - w1 + 30 - CF_WIDTH/2 - BRACKET_WIDTH, this.y, "fill_open"+suff).setDisplaySize(ICON_WIDTH, ICON_WIDTH));
            // NOTE: this inner computation is not correct anymore after adding + 30 - CF_WIDTH/2
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + (-w1 + w2)/2, this.y, "fill_connect"+suff).setDisplaySize(-ICON_WIDTH + w1 + w2 + BRACKET_WIDTH*2, ICON_WIDTH));//.setScale((-ICON_WIDTH + w1 + w2 + BRACKET_WIDTH*2)/ICON_WIDTH, 1));
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + w2 - 30 + CF_WIDTH/2 + BRACKET_WIDTH, this.y, "fill_closed"+suff).setDisplaySize(ICON_WIDTH, ICON_WIDTH));
        }
        this.setDisplaySize(CF_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.antecedent.get_child(path.slice(1, path.length));
            case 'r':
                return this.consequent.get_child(path.slice(1, path.length));
            default:
                throw new Error("path string may only contain the letters 'l' and 'r'");
        }
    }

    offset(x: number): void {
        this.setX(this.x + x);
        this.antecedent.offset(x);
        this.consequent.offset(x);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setX(this.brackets[i].x + x);
        }
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setX(this.brackets[i].x * s);
            //this.brackets[i].setScale(this.brackets[i].texture.key == "bracket_compact" ? this.brackets[i].scaleX * s : this.brackets[i].scaleX, this.brackets[i].scaleY * s);
            this.brackets[i].setScale(this.brackets[i].scaleX * s, this.brackets[i].scaleY * s);
        }
        this.antecedent.scale_recursive(s);
        this.consequent.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.antecedent.set_depth(d);
        this.consequent.set_depth(d);
    }

    get_width(metaphor_mode: string): number {
        let CF_WIDTH = Formula_Graphics.get_cf_width(metaphor_mode);
        return CF_WIDTH*this.scaleX + this.antecedent.get_width(metaphor_mode) + this.consequent.get_width(metaphor_mode) + 2*BRACKET_WIDTH*this.scaleX;
    }

    get_atoms(atoms: string[]): Formula_Graphics_Element[] {
        return this.antecedent.get_atoms(atoms).concat(this.consequent.get_atoms(atoms));
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux.concat([this.antecedent, this.consequent]).concat(this.antecedent.get_children()).concat(this.consequent.get_children());
    }

    get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[] {
        return recursive ? this.brackets.concat(this.antecedent.get_embedding(true)).concat(this.consequent.get_embedding(true)) : this.brackets;
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        for(let i=0; i<this.brackets.length; i++) {
            container.add(this.brackets[i]);
        }
        container.add(this);
        this.antecedent.add_to_container(container);
        this.consequent.add_to_container(container);
    }
}

/**
 * A class representation of the disjunction operator
 */
 export class Disjunction_Graphics extends Formula_Graphics_Element {
    subject1: Formula_Graphics_Element;
    subject2: Formula_Graphics_Element;
    brackets: Phaser.GameObjects.Sprite[] = [];

    /**
     * Create a disjunction between two formulas
     * @param subject1 Formula to be disjunct
     * @param subject2 Formula to be disjunct
     */
    constructor(scene: Base_Scene, x: number, y: number, subject1: Formula_Graphics_Element, subject2: Formula_Graphics_Element, metaphor_mode: string, embedded: integer) {
        super(scene, x, y, "disjunction_"+metaphor_mode);
        this.subject1 = subject1;
        this.subject2 = subject2;

        let w1 = this.subject1.get_width(metaphor_mode);
        let w2 = this.subject2.get_width(metaphor_mode);
        let DISJ_WIDTH = Formula_Graphics.get_disj_width(metaphor_mode);

        if(embedded >= 0) {
            let suff = Formula_Graphics_Element.get_embedding_sprite_key(embedded);
            suff = ""; // TODO: quick fix to stop using bracket recolors
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x - w1 + 15 - DISJ_WIDTH/2 + BRACKET_WIDTH, this.y, "fill_open"+suff).setDisplaySize(ICON_WIDTH, ICON_WIDTH)); /* this.x - w1 - BRACKET_WIDTH */
            /* TODO: this is not right anymore for DISJ_WIDTH = 60 after introducing + 15 - DISJ_WIDTH. */
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + (-w1 + w2)/2, this.y, "fill_connect"+suff).setDisplaySize(-ICON_WIDTH + w1 + w2 + BRACKET_WIDTH*2, ICON_WIDTH));
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + w2 - 15 + DISJ_WIDTH/2 - BRACKET_WIDTH, this.y, "fill_closed"+suff).setDisplaySize(ICON_WIDTH, ICON_WIDTH)); /* this.x + w2 + BRACKET_WIDTH */
        }
        this.setDisplaySize(DISJ_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.subject1.get_child(path.slice(1, path.length));
            case 'r':
                return this.subject2.get_child(path.slice(1, path.length));
            default:
                throw new Error("path string may only contain the letters 'l' and 'r'");
        }
    }

    offset(x: number): void {
        this.setX(this.x + x);
        this.subject1.offset(x);
        this.subject2.offset(x);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setX(this.brackets[i].x + x);
        }
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setX(this.brackets[i].x * s);
            //this.brackets[i].setScale(this.brackets[i].texture.key == "bracket_compact" ? this.brackets[i].scaleX * s : this.brackets[i].scaleX, this.brackets[i].scaleY * s);
            this.brackets[i].setScale(this.brackets[i].scaleX * s, this.brackets[i].scaleY * s);
        }
        this.subject1.scale_recursive(s);
        this.subject2.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.subject1.set_depth(d);
        this.subject2.set_depth(d);
    }

    get_width(metaphor_mode: string): number {
        let DISJ_WIDTH = Formula_Graphics.get_disj_width(metaphor_mode);
        return DISJ_WIDTH*this.scaleX + this.subject1.get_width(metaphor_mode) + this.subject2.get_width(metaphor_mode) + 2*BRACKET_WIDTH*this.scaleX;
    }

    get_atoms(atoms: string[]): Formula_Graphics_Element[] {
        return this.subject1.get_atoms(atoms).concat(this.subject2.get_atoms(atoms));
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux.concat([this.subject1, this.subject2]).concat(this.subject1.get_children()).concat(this.subject2.get_children());
    }

    get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[] {
        return recursive ? this.brackets.concat(this.subject1.get_embedding(true)).concat(this.subject2.get_embedding(true)) : this.brackets;
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        for(let i=0; i<this.brackets.length; i++) {
            container.add(this.brackets[i]);
        }
        container.add(this);
        this.subject1.add_to_container(container);
        this.subject2.add_to_container(container);
    }
}
/**
 * A class representation of the conjunction operator
 */
 export class Conjunction_Graphics extends Formula_Graphics_Element {
    subject1: Formula_Graphics_Element;
    subject2: Formula_Graphics_Element;
    brackets: Phaser.GameObjects.Sprite[] = [];

    /**
     * Create a conjunction between two formulas
     * @param subject1 Formula to be conjunct
     * @param subject2 Formula to be conjunct
     */
    constructor(scene: Base_Scene, x: number, y: number, subject1: Formula_Graphics_Element, subject2: Formula_Graphics_Element, metaphor_mode: string, embedded: integer) {
        super(scene, x, y, "conjunction_"+metaphor_mode);
        this.subject1 = subject1;
        this.subject2 = subject2;

        let w1 = this.subject1.get_width(metaphor_mode);
        let w2 = this.subject2.get_width(metaphor_mode);
        let DISJ_WIDTH = Formula_Graphics.get_disj_width(metaphor_mode);

        if(embedded >= 0) {
            let suff = Formula_Graphics_Element.get_embedding_sprite_key(embedded);
            suff = ""; // TODO: quick fix to stop using bracket recolors
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x - w1 + 15 - DISJ_WIDTH/2 + BRACKET_WIDTH, this.y, "fill_open"+suff).setDisplaySize(ICON_WIDTH, ICON_WIDTH)); /* this.x - w1 - BRACKET_WIDTH */
            /* TODO: this is not right anymore for DISJ_WIDTH = 60 after introducing + 15 - DISJ_WIDTH. */
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + (-w1 + w2)/2, this.y, "fill_connect"+suff).setDisplaySize(-ICON_WIDTH + w1 + w2 + BRACKET_WIDTH*2, ICON_WIDTH));
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + w2 - 15 + DISJ_WIDTH/2 - BRACKET_WIDTH, this.y, "fill_closed"+suff).setDisplaySize(ICON_WIDTH, ICON_WIDTH)); /* this.x + w2 + BRACKET_WIDTH */
        }
        this.setDisplaySize(DISJ_WIDTH, ICON_WIDTH);
        // this.setTint(0xdd0000); // TODO: just red tint doesnt look great
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.subject1.get_child(path.slice(1, path.length));
            case 'r':
                return this.subject2.get_child(path.slice(1, path.length));
            default:
                throw new Error("path string may only contain the letters 'l' and 'r'");
        }
    }

    offset(x: number): void {
        this.setX(this.x + x);
        this.subject1.offset(x);
        this.subject2.offset(x);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setX(this.brackets[i].x + x);
        }
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setX(this.brackets[i].x * s);
            //this.brackets[i].setScale(this.brackets[i].texture.key == "bracket_compact" ? this.brackets[i].scaleX * s : this.brackets[i].scaleX, this.brackets[i].scaleY * s);
            this.brackets[i].setScale(this.brackets[i].scaleX * s, this.brackets[i].scaleY * s);
        }
        this.subject1.scale_recursive(s);
        this.subject2.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.subject1.set_depth(d);
        this.subject2.set_depth(d);
    }

    get_width(metaphor_mode: string): number {
        let DISJ_WIDTH = Formula_Graphics.get_disj_width(metaphor_mode);
        return DISJ_WIDTH*this.scaleX + this.subject1.get_width(metaphor_mode) + this.subject2.get_width(metaphor_mode) + 2*BRACKET_WIDTH*this.scaleX;
    }

    get_atoms(atoms: string[]): Formula_Graphics_Element[] {
        return this.subject1.get_atoms(atoms).concat(this.subject2.get_atoms(atoms));
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux.concat([this.subject1, this.subject2]).concat(this.subject1.get_children()).concat(this.subject2.get_children());
    }

    get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[] {
        return recursive ? this.brackets.concat(this.subject1.get_embedding(true)).concat(this.subject2.get_embedding(true)) : this.brackets;
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        for(let i=0; i<this.brackets.length; i++) {
            container.add(this.brackets[i]);
        }
        container.add(this);
        this.subject1.add_to_container(container);
        this.subject2.add_to_container(container);
    }
}

/**
 * A graphics representation of the modal possibility operator
 */
 export class Possibility_Graphics extends Formula_Graphics_Element {
    subject: Formula_Graphics_Element;

    /**
     * Visualize the possibility formula
     * @param subject Formula graphics for possibility to be applied to
     */
    constructor(scene: Base_Scene, x: number, y: number, subject: Formula_Graphics_Element, metaphor_mode: string) {
        super(scene, x, y, "possibility_"+metaphor_mode);
        this.subject = subject;
        this.setDisplaySize(ICON_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.subject.get_child(path.slice(1, path.length));
            default:
                throw new Error("Possibility only has left child");
        }
    }

    offset(x: number): void {
        this.setX(this.x + x);
        this.subject.offset(x);
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
        this.subject.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.subject.set_depth(d);
    }

    get_width(metaphor_mode: string): number {
        return ICON_WIDTH*this.scaleX + this.subject.get_width(metaphor_mode);
    }

    get_atoms(atoms: string[]): Formula_Graphics_Element[] {
        return this.subject.get_atoms(atoms);
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux.concat([this.subject]).concat(this.subject.get_children());
    }

    get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[] {
        return recursive ? this.subject.get_embedding(true) : [];
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        container.add(this);
        this.subject.add_to_container(container);
    }
}
/**
 * A graphics representation of the modal necessity operator
 */
 export class Necessity_Graphics extends Formula_Graphics_Element {
    subject: Formula_Graphics_Element;

    /**
     * Visualize the necessity formula
     * @param subject Formula graphics for necessity to be applied to
     */
    constructor(scene: Base_Scene, x: number, y: number, subject: Formula_Graphics_Element, metaphor_mode: string) {
        super(scene, x, y, "necessity_"+metaphor_mode);
        this.subject = subject;
        this.setDisplaySize(ICON_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.subject.get_child(path.slice(1, path.length));
            default:
                throw new Error("Necessity only has left child");
        }
    }

    offset(x: number): void {
        this.setX(this.x + x);
        this.subject.offset(x);
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
        this.subject.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.subject.set_depth(d);
    }

    get_width(metaphor_mode: string): number {
        return ICON_WIDTH*this.scaleX + this.subject.get_width(metaphor_mode);
    }

    get_atoms(atoms: string[]): Formula_Graphics_Element[] {
        return this.subject.get_atoms(atoms);
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux.concat([this.subject]).concat(this.subject.get_children());
    }

    get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[] {
        return recursive ? this.subject.get_embedding(true) : [];
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        container.add(this);
        this.subject.add_to_container(container);
    }
}

/**
 * A graphics representation of the logical negation operator
 */
 export class Negation_Graphics extends Formula_Graphics_Element {
    subject: Formula_Graphics_Element;

    /**
     * Visualize the negation of a formula
     * @param subject Formula graphics to be negated
     */
    constructor(scene: Base_Scene, x: number, y: number, subject: Formula_Graphics_Element, metaphor_mode: string) {
        super(scene, x, y, "negation_"+metaphor_mode);
        this.subject = subject;
        let NEG_WIDTH = Formula_Graphics.get_neg_width(metaphor_mode);
        this.setDisplaySize(NEG_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.subject.get_child(path.slice(1, path.length));
            default:
                throw new Error("Negation only has left child");
        }
    }

    offset(x: number): void {
        this.setX(this.x + x);
        this.subject.offset(x);
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
        this.subject.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.subject.set_depth(d);
    }

    get_width(metaphor_mode: string): number {
        let NEG_WIDTH = Formula_Graphics.get_neg_width(metaphor_mode);
        return NEG_WIDTH*this.scaleX + this.subject.get_width(metaphor_mode);
    }

    get_atoms(atoms: string[]): Formula_Graphics_Element[] {
        return this.subject.get_atoms(atoms);
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux.concat([this.subject]).concat(this.subject.get_children());
    }

    get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[] {
        return recursive ? this.subject.get_embedding(true) : [];
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        container.add(this);
        this.subject.add_to_container(container);
    }
}

/**
 * A class representation of atomic statements
 */
export class Atom_Graphics extends Formula_Graphics_Element {
    readonly value: string;

    /**
     * Visualize an atomic statement
     * @param value a linguistic description of the atomic statement
     */
    constructor(scene: Base_Scene, x: number, y: number, value: string, atoms: string[], metaphor_mode: string) {
        let index = atoms.findIndex((curr) => curr == value);
        super(scene, x, y, ((index != -1) ? "atom_" + index : "atom") + "_" + metaphor_mode);
        this.value = value;
        this.setDisplaySize(ICON_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }

    offset(x: number): void {
        this.setX(this.x + x);
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
    }

    get_width(metaphor_mode: string): number {
        return ICON_WIDTH*this.scaleX;
    }

    get_atoms(atoms: string[]): Formula_Graphics_Element[] {
        return atoms.includes(this.value) ? [this] : [];
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux;
    }

    get_embedding(): Phaser.GameObjects.Sprite[] {
        return [];
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        container.add(this);
    }
}

/**
 * A class representation of the bottom symbol
 */
 export class Bottom_Graphics extends Formula_Graphics_Element {
    
    /**
     * Create a bottom symbol
     */
    constructor(scene: Base_Scene, x: number, y: number, metaphor_mode: string) {
        super(scene, x, y, "false_"+metaphor_mode);
        this.setDisplaySize(ICON_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }

    offset(x: number): void {
        this.setX(this.x + x);
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
    }

    get_width(metaphor_mode: string): number {
        return ICON_WIDTH*this.scaleX;
    }

    get_atoms(): Formula_Graphics_Element[] {
        return [];
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux;
    }

    get_embedding(): Phaser.GameObjects.Sprite[] {
        return [];
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        container.add(this);
    }
}

/**
 * A class representation of the top symbol
 */
 export class Top_Graphics extends Formula_Graphics_Element {
    
    /**
     * Create a top symbol
     */
    constructor(scene: Base_Scene, x: number, y: number, metaphor_mode: string) {
        super(scene, x, y, "true_"+metaphor_mode);
        this.setDisplaySize(ICON_WIDTH, ICON_WIDTH);
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }

    offset(x: number): void {
        this.setX(this.x + x);
    }

    scale_recursive(s: number): void {
        this.setX(this.x * s);
        this.setScale(this.scaleX * s, this.scaleY * s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
    }

    get_width(metaphor_mode: string): number {
        return ICON_WIDTH*this.scaleX;
    }

    get_atoms(): Formula_Graphics_Element[] {
        return [];
    }

    get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
        return aux;
    }

    get_embedding(): Phaser.GameObjects.Sprite[] {
        return [];
    }

    add_to_container(container: Phaser.GameObjects.Container): void {
        container.add(this);
    }
}

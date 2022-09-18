import { Rules } from "../game/Game_Rules";
import Base_Scene from "../util/Base_Scene";
import { Atom, Bottom, Cf_Would, Disjunction, Formula, Negation } from "../util/Cf_Logic";
import { duplicate_texture, dye_texture, fill_texture, Game_Graphics_Mode, hueshift_texture } from "../util/UI_Utils";
import { Formula_Animations } from "./animations/Formula_Animations";

export const ICON_WIDTH = 60;
export const BRACKET_WIDTH = 10;

const NUM_RECOLORS = 6;

export class Formula_Graphics extends Phaser.GameObjects.Container {
    private formula: Formula_Graphics_Element;
    private atoms: string[];
    private embedding_depth: integer = 0;

    private next_formula?: Formula;

    constructor(scene: Base_Scene, x: number, y: number, formula: Formula, atoms: string[], embedding_depth: integer = 0) {
        super(scene, x, y);

        this.atoms = atoms;
        this.embedding_depth = embedding_depth;
        this.formula = Formula_Graphics_Element.parse(scene, formula, 0, 0, this.atoms);
        this.formula.add_to_container(this);
    }

    static load_sprites(scene: Phaser.Scene) {
        scene.load.image("false", "assets/False.png");
        scene.load.image("true", "assets/True.png");
        scene.load.image("atom", "assets/Atom.png");
        scene.load.image("glow", "assets/Glow.png");
        scene.load.image("negation", "assets/Negation.png");
        scene.load.image("disjunction", "assets/Disjunction.png");
        scene.load.image("cf_would", "assets/Cf_Would.png");

        /*scene.load.image("bracket_open", "assets/Bracket_Opener.png");
        scene.load.image("bracket_connect", "assets/Bracket_Connector.png");
        scene.load.image("bracket_close", "assets/Bracket_Closer.png");
        scene.load.image("bracket_compact", "assets/Bracket_Compact.png");

        scene.load.image("bracket_open_fill", "assets/Bracket_Opener_Filled.png");
        scene.load.image("bracket_connect_fill", "assets/Bracket_Connector_Filled.png");
        scene.load.image("bracket_close_fill", "assets/Bracket_Closer_Filled.png");
        scene.load.image("bracket_compact_fill", "assets/Bracket_Compact_Filled.png");

        scene.load.image("bracket_opened", "assets/Bracket_Open.png");
        scene.load.image("bracket_closed", "assets/Bracket_Closed.png");*/

        scene.load.image("fill_open", "assets/Fill_Open.png");
        scene.load.image("fill_connect", "assets/Fill_Connect.png");
        scene.load.image("fill_closed", "assets/Fill_Closed.png");
    }

    static configure_sprites(scene: Phaser.Scene) {
        let atom_colors = [0xFFCB42, 0x42855B, 0x533483, 0xC55300, 0xA2B5BB, 0xFF8FB1, 0xE94560, 0x84513D];
        for(let i=0; i<NUM_RECOLORS; i++) {
            duplicate_texture(scene, "fill_open", "fill_open_"+(i).toString());
            duplicate_texture(scene, "fill_connect", "fill_connect_"+(i).toString());
            duplicate_texture(scene, "fill_closed", "fill_closed_"+(i).toString());
            hueshift_texture(scene, "fill_open_"+(i).toString(), i*(360/NUM_RECOLORS));
            hueshift_texture(scene, "fill_connect_"+(i).toString(), i*(360/NUM_RECOLORS));
            hueshift_texture(scene, "fill_closed_"+(i).toString(), i*(360/NUM_RECOLORS));

            duplicate_texture(scene, "atom", "atom_"+(i).toString());
            dye_texture(scene, "atom_"+(i).toString(), atom_colors[i]);
        }
    }

    animate_transition(transition: [Game_Graphics_Mode, Game_Graphics_Mode]): number {
        let timeline = this.scene.tweens.createTimeline();
        let anim_time = Formula_Animations.fill_transition_animation_timeline(timeline, transition, this);
        timeline.play();
        return anim_time;
    }

    animate(formula: Formula, rule: Rules): number {
        this.next_formula = formula;
        if(rule == Rules.Defender_Victory || rule == Rules.Attacker_Victory) { this.next_formula = undefined; }
        if([Rules.Negated_Left_OR, Rules.Negated_Right_OR, Rules.Attacker_Vacuous_Truth_Claim].includes(rule)) { this.embedding_depth++; }
        return this.start_animation(rule);
    }

    end_animation() {
        if(this.next_formula != undefined) {
            this.removeAll(true);
            this.formula = Formula_Graphics_Element.parse((this.scene as Base_Scene), this.next_formula, 0, 0, this.atoms, this.embedding_depth);
            this.formula.add_to_container(this);
        }
    }

    /**
     * Add another formula until the main formula is re-set
     * @returns temporarily added Formula_Graphics_Element
     */
    add_temporary_formula(formula: string): Formula_Graphics_Element {
        let temporary = Formula_Graphics_Element.parse((this.scene as Base_Scene), Formula.parse(formula), 0, 0, this.atoms, this.embedding_depth);
        temporary.add_to_container(this);
        return temporary;
    }

    set_atoms(atoms: string[]) {
        this.atoms = atoms;
    }

    set_formula(formula: Formula) {
        this.removeAll(true);
        this.next_formula = undefined;
        this.formula = Formula_Graphics_Element.parse((this.scene as Base_Scene), formula, 0, 0, this.atoms, this.embedding_depth);
        this.formula.add_to_container(this);
    }

    set_embedding_depth(depth: integer) {
        this.embedding_depth = depth;
    }

    start_animation(rule: Rules): number {
        let timeline = this.scene.tweens.createTimeline();
        let anim_time = Formula_Animations.fill_animation_timeline(timeline, rule, this);
        timeline.play();
        return anim_time;
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
        return this.formula.get_width();
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
    static parse(scene: Base_Scene, to_parse: Formula, x: number, y: number, atoms: string[]=[], embedded: number=0): Formula_Graphics_Element {
        switch(true) {
            case to_parse instanceof Cf_Would:
                let antecedent = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x, y, atoms, embedded+1);
                let consequent = Formula_Graphics_Element.parse(scene, to_parse.get_child("r"), x, y, atoms, embedded+1);
                antecedent.offset(- ICON_WIDTH/2 - consequent.get_width()/2);
                consequent.offset(+ ICON_WIDTH/2 + antecedent.get_width()/2);
                return new Cf_Would_Graphics(scene, x + (antecedent.get_width() - consequent.get_width())/2, y, antecedent, consequent, embedded);
            case to_parse instanceof Disjunction:
                let subject1 = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x, y, atoms, embedded+1);
                let subject2 = Formula_Graphics_Element.parse(scene, to_parse.get_child("r"), x, y, atoms, embedded+1);
                subject1.offset(- ICON_WIDTH/2 - subject2.get_width()/2);
                subject2.offset(+ ICON_WIDTH/2 + subject1.get_width()/2);
                return new Disjunction_Graphics(scene, x + (subject1.get_width() - subject2.get_width())/2, y, subject1, subject2, embedded);
            case to_parse instanceof Negation:
                let subject = Formula_Graphics_Element.parse(scene, to_parse.get_child("l"), x + ICON_WIDTH/2, y, atoms, embedded);
                return new Negation_Graphics(scene, x - subject.get_width()/2, y, subject);
            case to_parse instanceof Atom:
                return new Atom_Graphics(scene, x, y, (to_parse as Atom).value,  atoms);
            case to_parse instanceof Bottom:
                return new Bottom_Graphics(scene, x, y);
            default:
                throw new Error("Cannot parse invalid formula");
        }
    };

    abstract offset(x: number): void;

    abstract scale_recursive(s: number): void;

    abstract set_depth(d: number): void;

    abstract get_width(): number;

    abstract get_children(aux?: Formula_Graphics_Element[]): Formula_Graphics_Element[];
    
    abstract get_embedding(recursive?: boolean): Phaser.GameObjects.Sprite[];

    abstract add_to_container(container: Phaser.GameObjects.Container): void;

    static get_embedding_sprite_key(embedded: integer): string {
        return "_"+(embedded % NUM_RECOLORS).toString();
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
    constructor(scene: Base_Scene, x: number, y: number, antedecent: Formula_Graphics_Element, consequent: Formula_Graphics_Element, embedded: integer) {
        super(scene, x, y, "cf_would");
        this.antecedent = antedecent;
        this.consequent = consequent;

        let w1 = this.antecedent.get_width();
        let w2 = this.consequent.get_width();

        if(embedded >= 0) {
            let suff = Formula_Graphics_Element.get_embedding_sprite_key(embedded);
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x - w1 - BRACKET_WIDTH, this.y, "fill_open"+suff));
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + (-w1 + w2)/2, this.y, "fill_connect"+suff).setScale((-ICON_WIDTH + w1 + w2 + BRACKET_WIDTH*2)/ICON_WIDTH, 1));
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + w2 + BRACKET_WIDTH, this.y, "fill_closed"+suff));
        }
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
        this.setScale(this.scaleX * s, this.scaleY * s);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setScale(this.brackets[i].texture.key == "bracket_compact" ? this.brackets[i].scaleX * s : this.brackets[i].scaleX, this.brackets[i].scaleY * s);
        }
        this.antecedent.scale_recursive(s);
        this.consequent.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.antecedent.set_depth(d);
        this.consequent.set_depth(d);
    }

    get_width(): number {
        return ICON_WIDTH + this.antecedent.get_width() + this.consequent.get_width() + 2*BRACKET_WIDTH;
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
    constructor(scene: Base_Scene, x: number, y: number, subject1: Formula_Graphics_Element, subject2: Formula_Graphics_Element, embedded: integer) {
        super(scene, x, y, "disjunction");
        this.subject1 = subject1;
        this.subject2 = subject2;

        let w1 = this.subject1.get_width();
        let w2 = this.subject2.get_width();

        if(embedded >= 0) {
            let suff = Formula_Graphics_Element.get_embedding_sprite_key(embedded);
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x - w1 - BRACKET_WIDTH, this.y, "fill_open"+suff));
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + (-w1 + w2)/2, this.y, "fill_connect"+suff).setScale((-ICON_WIDTH + w1 + w2 + BRACKET_WIDTH*2)/ICON_WIDTH, 1));
            this.brackets.push(new Phaser.GameObjects.Sprite(this.scene, this.x + w2 + BRACKET_WIDTH, this.y, "fill_closed"+suff));
        }
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
        this.setScale(this.scaleX * s, this.scaleY * s);
        for(let i=0; i<this.brackets.length; i++) {
            this.brackets[i].setScale(this.brackets[i].texture.key == "bracket_compact" ? this.brackets[i].scaleX * s : this.brackets[i].scaleX, this.brackets[i].scaleY * s);
        }
        this.subject1.scale_recursive(s);
        this.subject2.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.subject1.set_depth(d);
        this.subject2.set_depth(d);
    }

    get_width(): number {
        return ICON_WIDTH + this.subject1.get_width() + this.subject2.get_width() + 2*BRACKET_WIDTH;
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
 * A graphics representation of the logical negation operator
 */
 export class Negation_Graphics extends Formula_Graphics_Element {
    subject: Formula_Graphics_Element;

    /**
     * Visualize the negation of a formula
     * @param subject Formula graphics to be negated
     */
    constructor(scene: Base_Scene, x: number, y: number, subject: Formula_Graphics_Element) {
        super(scene, x, y, "negation");
        this.subject = subject;
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
        this.setScale(this.scaleX * s, this.scaleY * s);
        this.subject.scale_recursive(s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
        this.subject.set_depth(d);
    }

    get_width(): number {
        return ICON_WIDTH + this.subject.get_width();
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
    constructor(scene: Base_Scene, x: number, y: number, value: string, atoms: string[]) {
        let index = atoms.findIndex((curr) => curr == value);
        super(scene, x, y, (index != -1) ? "atom_" + index : "atom");
        this.value = value;
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }

    offset(x: number): void {
        this.setX(this.x + x);
    }

    scale_recursive(s: number): void {
        this.setScale(this.scaleX * s, this.scaleY * s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
    }

    get_width(): number {
        return ICON_WIDTH;
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
    constructor(scene: Base_Scene, x: number, y: number) {
        super(scene, x, y, "false");
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }

    offset(x: number): void {
        this.setX(this.x + x);
    }

    scale_recursive(s: number): void {
        this.setScale(this.scaleX * s, this.scaleY * s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
    }

    get_width(): number {
        return ICON_WIDTH;
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
    constructor(scene: Base_Scene, x: number, y: number) {
        super(scene, x, y, "true");
    }

    get_child(path: string): Formula_Graphics_Element {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }

    offset(x: number): void {
        this.setX(this.x + x);
    }

    scale_recursive(s: number): void {
        this.setScale(this.scaleX * s, this.scaleY * s);
    }

    set_depth(d: number): void {
        this.setDepth(d);
    }

    get_width(): number {
        return ICON_WIDTH;
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
import { Game_Controller } from "../game/Game_Controller";
import { Rule, Rules, Rules_Controller } from "../game/Game_Rules";
import { Game_Turn_Type, State_Mode } from "../util/Game_Utils";
import { Supposition_Panel } from "./Supposition_Panel";
import { Utils } from "../util/Utils";
import { Bottom, Formula } from "../util/Cf_Logic";
import { Game_State } from "../game/Game_State";
import { Choice } from "./Choice";
import { Game_Graphics_Mode, Graph_Graphics_Mode, Rule_Descriptions, text_style } from "../util/UI_Utils";
import { Graph_Graphics } from "./Graph_Graphics";
import Base_Scene from "../util/Base_Scene";
import { Formula_Graphics } from "./Formula_Graphics";

/**
 * A class governing the visual representation of the abstract game of counterfactuals
 */
export class Graphics_Controller {
    private scene: Base_Scene;
    private canvas: HTMLCanvasElement;
    private sup_panel: Supposition_Panel;
    private graph_graphics: Graph_Graphics;
    private formula: Formula_Graphics;
    private choice: Choice;
    private caption: Phaser.GameObjects.Text;

    private mode: Game_Graphics_Mode = Game_Graphics_Mode.Formula;
    private next_mode: Game_Graphics_Mode = Game_Graphics_Mode.Formula;
    private next_formula: Formula;
    private next_state: Game_State;
    private next_move: Rule;
    private next_option1: Rule;
    private next_option2: Rule;
    private next_animate: boolean = false;

    private ready: boolean = false;
    private idle_since: number = Date.now();
    private idle_time: number = 2000;

    constructor(scene: Base_Scene, canvas: HTMLCanvasElement, state: Game_State) {
        this.scene = scene;
        this.canvas = canvas;
        this.sup_panel = new Supposition_Panel(scene, canvas.width/2, canvas.height - 100);
        this.graph_graphics = new Graph_Graphics(scene, canvas.width/2, (canvas.height - 200)/2, state, state.get_current_world().index, [[0, 0], [-150, 0], [0, -150], [150, 0], [0, 150]], [[0, 1], [0, 4], [1, 2], [3, 4]], state.get_formula().generate_atom_list());

        this.formula = new Formula_Graphics(scene, canvas.width/2, canvas.height - 100, state.get_formula());
        this.choice = new Choice(scene);

        this.caption = new Phaser.GameObjects.Text(scene, canvas.width/2, canvas.height - 165, "", text_style);
        this.caption.setOrigin(0.5, 0.5);
        this.caption.setVisible(false);

        scene.children.add(this.sup_panel);
        scene.children.add(this.graph_graphics);
        scene.children.add(this.formula);
        this.choice.add_to_scene();
        this.scene.children.add(this.caption);

        this.set_mode(Game_Graphics_Mode.Formula);
        this.choice.set_visible(false);
    }

    update(time: number) {
        switch(this.mode) {
            case Game_Graphics_Mode.Formula:
                if(time >= this.idle_since + this.idle_time) {
                    this.formula.end_animation();
                    this.ready = true;
                    this.idle_time = 0;
                }
                break;
            case Game_Graphics_Mode.Formula_Choice:
                if(this.choice.is_choice_made()) {
                    this.caption.text = Rule_Descriptions[this.choice.get_choice().get_name()];
                    this.ready = true;
                }
                break;
            case Game_Graphics_Mode.World_Choice:
                if(this.graph_graphics.is_choice_made()) {
                    this.ready = true;
                }
                break;
            case Game_Graphics_Mode.Transition:
                if(time >= this.idle_since + this.idle_time && this.next_mode != undefined) {
                    console.log("> ending transition to "+Game_Graphics_Mode[this.next_mode]);
                    this.set_mode(this.next_mode);
                    switch(this.next_mode) {
                        case Game_Graphics_Mode.Formula:
                            if(this.next_animate) {
                                this.animate_move(this.next_state, this.next_move);
                            } else {
                                this.set_formula(this.next_state, this.next_formula);
                            }
                            break;
                        case Game_Graphics_Mode.Formula_Choice:
                            this.set_choice(this.next_state, this.next_option1, this.next_option2);
                            break;
                        case Game_Graphics_Mode.World_Choice:
                            this.set_world_choice();
                            break;
                    }
                }
                break;
        }
    }

    resize_graphics() {
        this.sup_panel.resize();
        this.choice.resize();
        this.graph_graphics.resize();
        this.caption.setX(this.scene.get_width()/2);
        this.caption.setY(this.scene.get_height() - 165);
        this.formula.setX(this.scene.get_width()/2);
        this.formula.setY(this.scene.get_height() - 100);
    }

    set_world_choice() {
        if(this.mode != Game_Graphics_Mode.World_Choice) {
            this.transition_mode(Game_Graphics_Mode.World_Choice);
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        this.caption.text = "Choose a reachable world:";
        this.graph_graphics.set_mode(Graph_Graphics_Mode.World_Choice);
        this.ready = false;
    }

    set_choice(state: Game_State, option1: Rule, option2: Rule, atoms?: string[]) {
        if(this.mode != Game_Graphics_Mode.Formula_Choice) {
            console.log("> transitioning to Formula_Choice");
            this.transition_mode(Game_Graphics_Mode.Formula_Choice);
            this.next_option1 = option1;
            this.next_option2 = option2;
            this.next_state = state;
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        this.caption.text = "Choose a subformula:";
        this.choice.set(state, option1, option2, atoms);
        this.ready = false;
    }

    set_formula(state: Game_State, formula: Formula, atoms?: string[]) {
        if(this.mode != Game_Graphics_Mode.Formula) {
            console.log("> transitioning to Formula");
            this.transition_mode(Game_Graphics_Mode.Formula);
            this.next_formula = formula;
            this.next_state = state;
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        console.log("> setting formula " + formula.to_string());
        this.formula.set_formula(formula);
        (state.get_mode() == State_Mode.Counterfactual) ? this.graph_graphics.set_delim_world(state.get_delim_world().index) : this.graph_graphics.clear_delim_world();
        this.graph_graphics.set_current_world(state.get_current_world().index);
    }

    animate_move(state: Game_State, move: Rule, atoms?: string[]) {
        if(this.mode != Game_Graphics_Mode.Formula) {
            console.log("> transitioning to Formula");
            this.transition_mode(Game_Graphics_Mode.Formula);
            this.next_move = move;
            this.next_state = state;
            this.next_animate = true;
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        this.caption.text = Rule_Descriptions[move.get_name()];
        let applied = move.apply(state);
        console.log("> animating move " + Rules[move.get_name()] + " => " + applied.get_formula().to_string());
        this.idle(this.formula.animate(applied.get_formula(), move.get_name()));
        
        (applied.get_mode() == State_Mode.Counterfactual) ? this.graph_graphics.set_delim_world(applied.get_delim_world().index) : this.graph_graphics.clear_delim_world();
        this.graph_graphics.set_current_world(applied.get_current_world().index);
    }

    transition_mode(mode: Game_Graphics_Mode) {
        let old_mode = this.mode;
        this.mode = Game_Graphics_Mode.Transition;
        this.next_mode = mode;
        switch(true) {
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Formula_Choice:
                console.log("> animating transition Formula -> Formula_Choice");
                this.idle(this.formula.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.Formula_Choice && this.next_mode == Game_Graphics_Mode.Formula:
                console.log("> animating transition Formula_Choice -> Formula");
                this.idle(this.choice.animate_transition([old_mode, this.next_mode]));
                return;
            default:
                console.log("> skipping transition");
                this.set_mode(this.next_mode);
                return;
        }
    }

    private set_mode(mode: Game_Graphics_Mode) {
        this.mode = mode;
        switch(mode) {
            case Game_Graphics_Mode.Formula:
                this.formula.setVisible(true);
                this.choice.set_visible(false);
                this.caption.setVisible(true);
                break;
            case Game_Graphics_Mode.Formula_Choice:
                this.formula.setVisible(false);
                this.choice.set_visible(true);
                this.caption.setVisible(true);
                break;
            case Game_Graphics_Mode.World_Choice:
                this.formula.setVisible(true);
                this.choice.set_visible(false);
                this.caption.setVisible(true);
                break;
        }
    }

    get_mode(): Game_Graphics_Mode {
        return this.mode;
    }

    get_choice(): Rule {
        return this.choice.get_choice();
    }

    get_world_choice(): integer {
        return this.graph_graphics.get_chosen_world();
    }

    is_ready(): boolean {
        return this.ready;
    }

    private idle(time: number) {
        this.ready = false;
        this.idle_since = Date.now();
        this.idle_time = time;
    }

    static load_sprites(scene: Phaser.Scene) {
        Graph_Graphics.load_sprites(scene);
        Formula_Graphics.load_sprites(scene);
    }

    static configure_sprites(scene: Phaser.Scene) {
        Formula_Graphics.configure_sprites(scene);
    }
}
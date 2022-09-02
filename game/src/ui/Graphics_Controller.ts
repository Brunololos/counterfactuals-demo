import { Game_Controller } from "../game/Game_Controller";
import { Rule, Rules, Rules_Controller } from "../game/Game_Rules";
import { Game_Turn_Type, State_Mode } from "../util/Game_Utils";
import { Supposition_Panel } from "./Supposition_Panel";
import { Cf_Logic_Graphics } from "./Cf_Logic_Graphics";
import { Utils } from "../util/Utils";
import { Bottom, Formula } from "../util/Cf_Logic";
import { Game_State } from "../game/Game_State";
import { Choice } from "./Choice";
import { Game_Graphics_Mode, Graph_Graphics_Mode, text_style } from "../util/UI_Utils";
import { Graph_Graphics } from "./Graph_Graphics";

/**
 * A class governing the visual representation of the abstract game of counterfactuals
 */
export class Graphics_Controller {
    private scene: Phaser.Scene;
    private canvas: HTMLCanvasElement;
    private sup_panel: Supposition_Panel;
    private graph_graphics: Graph_Graphics;
    private formula: Cf_Logic_Graphics;
    private choice: Choice;
    private world_choice_info: Phaser.GameObjects.Text;

    private mode: Game_Graphics_Mode = Game_Graphics_Mode.Formula;

    private ready: boolean = false;
    private idle_since: number = Date.now();
    private idle_time: number = 2000;

    constructor(scene: Phaser.Scene, canvas: HTMLCanvasElement, state: Game_State) {
        this.scene = scene;
        this.canvas = canvas;
        this.sup_panel = new Supposition_Panel(scene, canvas.width/2, canvas.height - 100);
        this.graph_graphics = new Graph_Graphics(scene, canvas.width/2, (canvas.height - 200)/2, state, state.get_current_world().index, [[0, 0], [-150, 0], [0, -150], [150, 0], [0, 150]], [[0, 1], [0, 4], [1, 2], [3, 4]], state.get_formula().generate_atom_list());

        this.formula = new Cf_Logic_Graphics(scene, state.get_formula(), canvas.width/2, 500);
        this.choice = new Choice(scene);

        this.world_choice_info = new Phaser.GameObjects.Text(scene, canvas.width/2, 425, "Please select a world.", text_style);
        this.world_choice_info.setOrigin(0.5, 0.5);
        this.world_choice_info.setVisible(false);

        scene.children.add(this.sup_panel);
        scene.children.add(this.graph_graphics);
        scene.children.add(this.formula);
        this.choice.add_to_scene();
        this.scene.children.add(this.world_choice_info);

        this.set_mode(Game_Graphics_Mode.Formula);
        this.choice.set_visible(false);
    }

    update(time: number) {
        switch(this.mode) {
            case Game_Graphics_Mode.Formula:
                if(time >= this.idle_since + this.idle_time) {
                    this.ready = true;
                    this.idle_time = 0;
                }
                break;
            case Game_Graphics_Mode.Formula_Choice:
                if(this.choice.is_choice_made()) {
                    this.ready = true;
                }
                break;
            case Game_Graphics_Mode.World_Choice:
                if(this.graph_graphics.is_choice_made()) {
                    this.ready = true;
                }
                break;
        }
    }

    set_world_choice() {
        this.set_mode(Game_Graphics_Mode.World_Choice);
        this.graph_graphics.set_mode(Graph_Graphics_Mode.World_Choice);
        this.ready = false;
    }

    set_choice(state: Game_State, option1: Rule, option2: Rule, atoms?: string[]) {
        this.set_mode(Game_Graphics_Mode.Formula_Choice);
        this.choice.set(state, option1, option2, atoms);
        this.ready = false;
    }

    set_formula(state: Game_State, formula: Formula, atoms?: string[]) {
        this.set_mode(Game_Graphics_Mode.Formula);
        this.formula.set_formula(formula.to_string(atoms));
        this.ready = false;
        this.idle_since = Date.now(); // TODO: possibly pass the frame time, so we work on frame by frame basis
        this.idle_time = 2000;
        (state.get_mode() == State_Mode.Counterfactual) ? this.graph_graphics.set_delim_world(state.get_delim_world().index) : this.graph_graphics.clear_delim_world();
        this.graph_graphics.set_current_world(state.get_current_world().index);
    }

    animate_move(state: Game_State, move: Rule, atoms?: string[]) {
        this.set_mode(Game_Graphics_Mode.Formula);
        this.ready = false;
        this.idle_since = Date.now();
        let applied = move.apply(state);
        this.idle_time = this.formula.animate(applied.get_formula(), atoms);
        (applied.get_mode() == State_Mode.Counterfactual) ? this.graph_graphics.set_delim_world(applied.get_delim_world().index) : this.graph_graphics.clear_delim_world();
        this.graph_graphics.set_current_world(applied.get_current_world().index);
    }

    set_mode(mode: Game_Graphics_Mode) {
        this.mode = mode;
        switch(mode) {
            case Game_Graphics_Mode.Formula:
                this.formula.setVisible(true);
                this.choice.set_visible(false);
                this.world_choice_info.setVisible(false);
                break;
            case Game_Graphics_Mode.Formula_Choice:
                this.formula.setVisible(false);
                this.choice.set_visible(true);
                this.world_choice_info.setVisible(false);
                break;
            case Game_Graphics_Mode.World_Choice:
                this.formula.setVisible(true);
                this.choice.set_visible(false);
                this.world_choice_info.setVisible(true);
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
}
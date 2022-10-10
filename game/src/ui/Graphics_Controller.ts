import { Game_Controller } from "../game/Game_Controller";
import { Rule, Rules, Rules_Controller } from "../game/Game_Rules";
import { Game_Turn_Type, State_Mode } from "../util/Game_Utils";
import { Supposition_Panel } from "./Supposition_Panel";
import { Bottom, Cf_Would, Disjunction, Formula } from "../game/Cf_Logic";
import { Game_State } from "../game/Game_State";
import { Choice } from "./Choice";
import { create_cosmic_nebula_texture, dye_texture, Game_Graphics_Mode, Graph_Graphics_Mode, Rule_Descriptions, text_style } from "../util/UI_Utils";
import { Graph_Graphics } from "./Graph_Graphics";
import Base_Scene from "../util/Base_Scene";
import { Formula_Graphics } from "./Formula_Graphics";
import { Star } from "../graphics/Star";
import Game_Scene from "../scenes/Game";
import { Text_Animation } from "./animations/Text_Animations";

/**
 * A class governing the visual representation of the abstract game of counterfactuals
 */
export class Graphics_Controller {
    private scene: Base_Scene;
    private background: Phaser.GameObjects.Sprite;
    private stars: Phaser.GameObjects.Container;
    private back;
    private sup_panel;
    private graph_graphics: Graph_Graphics;
    private formula: Formula_Graphics;
    private choice: Choice;

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

    constructor(scene: Base_Scene, state: Game_State, world_positions: [number, number][]) {
        this.scene = scene;
        let w = scene.get_width();
        let h = scene.get_height();
        this.background = new Phaser.GameObjects.Sprite(scene, w/2, h/2, "space"+(scene as Game_Scene).get_level()).setDisplaySize(w, h).setDepth(-1);
        this.stars = this.create_stars(scene, w, h);
        //this.back = new Phaser.GameObjects.Sprite(scene, w-40, 25, "back");
        //this.back = new Phaser.GameObjects.Sprite(scene, w-0, 30, "back_big");
        this.back = this.create_back(scene, 25, 30);

        this.graph_graphics = new Graph_Graphics(scene, w/2, (h - 200)/2, state, state.get_current_world().index, world_positions, state.get_graph().get_edge_list());

        this.formula = new Formula_Graphics(scene, w/2, h - 105, state.get_formula(), state.get_atoms());
        this.choice = new Choice(scene, state);
        this.sup_panel = new Supposition_Panel(scene, w/2, h - 110, [this.formula, this.choice.get_option_graphic(0), this.choice.get_option_graphic(1), this.choice.get_option_boxes()[0], this.choice.get_option_boxes()[1]]);

        scene.add.existing(this.background);
        scene.add.existing(this.stars);

        scene.add.existing(this.back);

        scene.children.add(this.sup_panel);
        scene.children.add(this.graph_graphics);
        scene.children.add(this.formula);
        this.choice.add_to_scene();

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
            case Game_Graphics_Mode.Counterfactual_Choice:
            case Game_Graphics_Mode.Negated_Counterfactual_Choice:
                if(this.choice.is_choice_made()) {
                    this.sup_panel.set_caption(Rule_Descriptions[this.choice.get_choice().get_name()]);
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
                        case Game_Graphics_Mode.Counterfactual_Choice:
                        case Game_Graphics_Mode.Negated_Counterfactual_Choice:
                            this.set_choice(this.next_state, this.next_option1, this.next_option2);
                            break;
                        case Game_Graphics_Mode.World_Choice:
                            this.set_world_choice();
                            break;
                    }
                }
                break;
        }
        this.sup_panel.update();
    }

    set_world_choice() {
        if(this.mode != Game_Graphics_Mode.World_Choice) {
            console.log("> transitioning to World_Choice");
            this.transition_mode(Game_Graphics_Mode.World_Choice);
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        this.sup_panel.set_caption("Choose a reachable world:", Text_Animation.PULSE);
        this.ready = false;
    }

    set_choice(state: Game_State, option1: Rule, option2: Rule) {
        let is_cf_choice = (state.get_formula() instanceof Cf_Would);
        let is_neg_cf_choice = (state.get_formula().get_child("l") instanceof Cf_Would);
        let mode = is_cf_choice ? Game_Graphics_Mode.Counterfactual_Choice : Game_Graphics_Mode.Formula_Choice;
        mode = is_neg_cf_choice ? Game_Graphics_Mode.Negated_Counterfactual_Choice : mode;
        if(this.mode != mode) {
            console.log("> transitioning to "+Game_Graphics_Mode[mode]);
            this.transition_mode(mode);
            this.next_option1 = option1;
            this.next_option2 = option2;
            this.next_state = state;
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        switch(mode) {
            case Game_Graphics_Mode.Formula_Choice:
                this.sup_panel.set_caption("Choose a formula:", Text_Animation.PULSE);
                this.choice.set(state, option1, option2, this.formula.get_embedding_depth());
                break;
            case Game_Graphics_Mode.Counterfactual_Choice:
                this.sup_panel.set_caption("Claim vacuous truth or choose a sphere of accessibility", Text_Animation.PULSE);
                this.choice.set_cf(state, option2, option1, this.formula.get_embedding_depth(), state.get_current_world().get_edges()[0][0].index); // TODO: Switching option1/2 so, that the vacuous truth claim is left and sphere selection right
                break;
            case Game_Graphics_Mode.Negated_Counterfactual_Choice:
                this.sup_panel.set_caption("Evaluate the sphere delimiting world or choose a reachable world to disprove the counterfactual", Text_Animation.PULSE);
                this.choice.set_cf(state, option1, option2, this.formula.get_embedding_depth(), state.get_current_world().get_edges()[0][0].index);
                break;
        }
        this.ready = false;
    }

    set_formula(state: Game_State, formula: Formula) {
        if(this.mode != Game_Graphics_Mode.Formula) {
            console.log("> transitioning to Formula");
            this.transition_mode(Game_Graphics_Mode.Formula);
            this.next_formula = formula;
            this.next_state = state;
            this.next_animate = false;
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        console.log("> setting formula " + formula.to_string());
        let choice = (this.choice.is_choice_made()) ? this.choice.get_choice().get_name() : undefined ;
        this.formula.set_embedding_depth(this.formula.get_embedding_depth() + (( choice == Rules.Defender_Sphere_Selection || choice == Rules.Defender_World_Choice ) ? 0 : 1)); // TODO: find better way to check whether last Grame_Graphics_Mode was World_Choice
        this.formula.set_formula(formula);
        (state.get_mode() == State_Mode.Counterfactual) ? this.graph_graphics.set_delim_world(state.get_delim_world().index) : this.graph_graphics.clear_delim_world();
        this.graph_graphics.set_current_world(state.get_current_world().index);
    }

    animate_move(state: Game_State, move: Rule, delim_world?: integer) {
        if(this.mode != Game_Graphics_Mode.Formula) {
            console.log("> transitioning to Formula");
            this.transition_mode(Game_Graphics_Mode.Formula);
            this.next_move = move;
            this.next_state = state;
            this.next_animate = true;
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        this.sup_panel.set_caption(Rule_Descriptions[move.get_name()], (move.get_name() == Rules.Defender_Victory) ? Text_Animation.PULSE : Text_Animation.NONE);
        let applied = move.apply(state, delim_world);
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
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Negated_Counterfactual_Choice:
                console.log("> animating transition Formula -> Negated_Counterfactual_Choice");
                this.idle(this.formula.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Counterfactual_Choice:
                console.log("> animating transition Formula -> Counterfactual_Choice");
                this.idle(this.formula.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Formula_Choice:
                console.log("> animating transition Formula -> Formula_Choice");
                this.idle(this.formula.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.Formula_Choice && this.next_mode == Game_Graphics_Mode.Formula:
                console.log("> animating transition Formula_Choice -> Formula");
                this.idle(this.choice.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.Counterfactual_Choice && this.next_mode == Game_Graphics_Mode.Formula:
                console.log("> animating transition Counterfactual_Choice -> Formula");
                this.idle(this.choice.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.Negated_Counterfactual_Choice && this.next_mode == Game_Graphics_Mode.Formula:
                console.log("> animating transition Negated_Counterfactual_Choice -> Formula");
                this.idle(this.choice.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.Counterfactual_Choice && this.next_mode == Game_Graphics_Mode.World_Choice:
                console.log("> animating transition Counterfactual_Choice -> World_Choice");
                this.idle(this.choice.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.Negated_Counterfactual_Choice && this.next_mode == Game_Graphics_Mode.World_Choice:
                console.log("> animating transition Negated_Counterfactual_Choice -> World_Choice");
                this.idle(this.choice.animate_transition([old_mode, this.next_mode]));
                return;
            case old_mode == Game_Graphics_Mode.World_Choice && this.next_mode == Game_Graphics_Mode.Formula:
                console.log("> animating transition World_Choice -> Formula");
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
                this.graph_graphics.set_mode(Graph_Graphics_Mode.Display);
                break;
            case Game_Graphics_Mode.Formula_Choice:
            case Game_Graphics_Mode.Counterfactual_Choice:
            case Game_Graphics_Mode.Negated_Counterfactual_Choice:
                this.formula.setVisible(false);
                this.choice.set_visible(true);
                this.graph_graphics.set_mode(Graph_Graphics_Mode.Display);
                break;
            case Game_Graphics_Mode.World_Choice:
                //this.formula.setVisible(false);
                //this.choice.set_visible(true);
                this.graph_graphics.set_mode(Graph_Graphics_Mode.World_Choice);
                break;
        }
    }

    resize_graphics() {
        this.background.setDisplaySize(this.scene.get_width(), this.scene.get_height());
        this.background.setPosition(this.scene.get_width()/2, this.scene.get_height()/2);
        this.sup_panel.resize();
        this.choice.resize();
        this.graph_graphics.resize();
        this.formula.setX(this.scene.get_width()/2);
        this.formula.setY(this.scene.get_height() - 100);
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

    private create_stars(scene: Phaser.Scene, width: number, height: number): Phaser.GameObjects.Container {
        let stars = new Phaser.GameObjects.Container(scene, width/2, height/2);
        let num_stars = width*height / (2100); // Amount of stars to spawn are determined by target star density on canvas
        for(let i=0; i<num_stars; i++) {
            new Star(scene, Math.random()*width - (width/2), Math.random()*height - (height/2)).add_to_container(stars);
        }
        return stars;
    }

    private create_back(scene: Base_Scene, x, y) {
        var button = scene.rexUI.add.label({
            width: 60,
            height: 60,

            orientation: 0,

            icon: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "back_icon").setDisplaySize(40, 40).setAlpha(0.6)),

            space: {
                icon: 10,
                left: 15,
                right: 0,
                top: 0,
                bottom: 0,
            }
        }).layout();

        var buttons = scene.rexUI.add.buttons({
            x: x,
            y: y,
            buttons: [],
        })
        .addButton(button)
        .layout();

        buttons.on('button.over', function(button, index, pointer, event) {
            button.getElement('icon').setAlpha(1);
        })
        buttons.on('button.out', function(button, index, pointer, event) {
            button.getElement('icon').setAlpha(0.6);
        })
        buttons.on('button.click', function(button, index, pointer, event) {
            scene.scene.start('Level_Select_Scene');
        })

        return buttons;
    }

    static load_sprites(scene: Phaser.Scene) {
        Graph_Graphics.load_sprites(scene);
        Formula_Graphics.load_sprites(scene);
        Choice.load_sprites(scene);
        Supposition_Panel.load_sprites(scene);

        Star.load_sprites(scene);
        let level = (scene as Game_Scene).get_level();
        if(!scene.textures.getTextureKeys().includes("space"+level)) {
            create_cosmic_nebula_texture(scene, 1600, 1600, "space"+level);
            dye_texture(scene, "space"+level, 0x4C6793);
        }

        scene.load.image("back_panel", "assets/Slant_Right.png");
        scene.load.image("back_border", "assets/Slant_Right_Border.png");
        scene.load.image("back_fill", "assets/Slant_Right_Fill.png");
        scene.load.image("back_icon", "assets/Back_Icon.png");
    }

    static configure_sprites(scene: Phaser.Scene) {
        Formula_Graphics.configure_sprites(scene);
        Graph_Graphics.configure_sprites(scene);
        Star.configure_sprites(scene);
    }
}
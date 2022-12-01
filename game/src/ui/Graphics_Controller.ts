import { Game_Controller } from "../game/Game_Controller";
import { Rule, Rules, Rules_Controller } from "../game/Game_Rules";
import { Game_Turn_Type, Player, State_Mode } from "../util/Game_Utils";
import { Supposition_Panel } from "./Supposition_Panel";
import { Bottom, Cf_Would, Disjunction, Formula, Negation } from "../game/Cf_Logic";
import { Game_State } from "../game/Game_State";
import { Choice } from "./Choice";
import { create_cosmic_nebula_texture, describe_move, dye_texture, Game_Graphics_Mode, Graph_Graphics_Mode, Rule_Descriptions, text_style, world_choice_moves_to_mode } from "../util/UI_Utils";
import { Graph_Graphics } from "./Graph_Graphics";
import Base_Scene from "../util/Base_Scene";
import { Formula_Graphics, ICON_WIDTH } from "./Formula_Graphics";
import { Star } from "../graphics/Star";
import Game_Scene from "../scenes/Game";
import { Text_Animation } from "./animations/Text_Animations";
import { levels } from "../game/levels/Levels";
import { Text_Box_Controller } from "./Text_Box";
import { Rules_Column } from "./Rules_Column";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";
import { Icon_Text } from "./Icon_Text";

/**
 * A class governing the visual representation of the abstract game of counterfactuals
 */
export class Graphics_Controller {
    private scene: Base_Scene;
    private background: Phaser.GameObjects.Sprite;
    private stars: Phaser.GameObjects.Container;
    private back;
    private help;
    private rules_column: Rules_Column;
    private text_box;
    private sup_panel;
    private graph_graphics: Graph_Graphics;
    private formula: Formula_Graphics;
    private choice: Choice;
    private vacuous;

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
        let level = (scene as Game_Scene).get_level();
        this.background = new Phaser.GameObjects.Sprite(scene, w/2, h/2, "space"+((level % 10))).setDisplaySize(w, h).setDepth(-1);
        this.stars = this.create_stars(scene, w, h);
        this.back = this.create_back(scene, 25, 30);

        this.rules_column = new Rules_Column(scene, w-180, 0, state.get_formula().to_string());
        this.text_box = new Text_Box_Controller(scene, w/2, h-250, 500, 55, levels[level].description, levels[level].icon_keys);
        this.help = this.create_help(scene, w-35, 30, this.rules_column, this.text_box);

        this.formula = new Formula_Graphics(scene, w/2, h - 105, state.get_formula(), state.get_atoms());
        this.choice = new Choice(scene, state);
        this.sup_panel = new Supposition_Panel(scene, w/2, h - 110, [this.formula, this.choice.get_option_graphic(0), this.choice.get_option_graphic(1), this.choice.get_option_boxes()[0], this.choice.get_option_boxes()[1]]);

        this.graph_graphics = new Graph_Graphics(scene, w/2, (h - 200)/2, state, state.get_current_world().index, world_positions, state.get_graph().get_edge_list(), this);

        this.vacuous = this.create_vacuous(this.scene, "", w/2, h-235).setAlpha(0);

        scene.add.existing(this.background);
        scene.add.existing(this.stars);

        scene.children.add(this.graph_graphics);

        scene.add.existing(this.back);
        scene.add.existing(this.help);
        this.rules_column.add_to_scene();

        scene.children.add(this.sup_panel);
        scene.children.add(this.formula);
        this.choice.add_to_scene();

        this.rules_column.set_visible(false);
        this.set_mode(Game_Graphics_Mode.Formula);
        this.choice.set_visible(false);

        /* let text = new Phaser.GameObjects.Text(scene, w/2, h/2, "This is the logical Top Symbol:", text_style).setOrigin(0, 0.5);
        scene.add.existing(text);
        let top = new Phaser.GameObjects.Sprite(scene, w/2 + text.text.length*7, h/2, "true").setScale(0.5).setOrigin(0, 0.2);
        scene.add.existing(top); */
        //let textln = new Phaser.GameObjects.Text(scene, w/2 + text.text.length*7+ICON_WIDTH*0.6+5, h/2, "This is the logical Top Symbol:", text_style).setOrigin(0, 0.5);
        /* let textln = new Phaser.GameObjects.Text(scene, w/2, h/2, "                               And here comes more text.", text_style).setOrigin(0, 0);
        textln.setWordWrapWidth(200); */

        /* let textln = new Phaser.GameObjects.Text(scene, w/2, h/2, "This is the logical Top Symbol:         And here comes more text. Here comes more Blah and plaguies and stuff'n shite.", text_style).setOrigin(0, 0);
        textln.setWordWrapWidth(300);
        textln.setLineSpacing(2);
        scene.add.existing(textln); */

        //scene.get_canvas().getContext("2d")!.font = 10 + 'px';
        //var context = scene.get_canvas().getContext("2d");
        //context!.font = 10 + 'px';
        /* scene.add.rectangle(w/2, h/2, 490, 55, 0x444444, 1).setOrigin(0, 0);

        let c = new Phaser.GameObjects.Container(scene, w/2, h/2);
        //let icon_text = new Icon_Text(scene, 0, 0, 490, 55, "This is the logical Top Symbol:{copilot}And here comes more text. Here te{pilot}comes more Blah and plaguies and stuff'n stuff. {pilot} Text objects work by creating their own internal hidden Canvas and then renders text to it using the standard Canvas fillText API. It then creates a texture from this canvas which is rendered to your game during the render pass.", text_style);
        let icon_text = new Icon_Text(scene, 0, 0, 490, 55, "Du{pilot}und dein Kopilot{copilot}seid mit der wichtigen Mission betraut p p p und kam eine zweite Erde zu finden. "
                                                            + "Zu diesem Zweck wurde euer Raumschiff mit einem bahnbrechenden Parallelwelten-antrieb ausgerüstet,\n", text_style);
        icon_text.add_to_container(c);
        scene.add.existing(c); */
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
                    this.sup_panel.set_caption(Rule_Descriptions[this.choice.get_choice().get_name()]);
                    this.sup_panel.transition(this.choice.get_choice().get_player());
                    this.ready = true;
                }
                break;
            case Game_Graphics_Mode.Possibility_World_Choice:
            case Game_Graphics_Mode.Necessity_World_Choice:
            case Game_Graphics_Mode.Sphere_Selection:
            case Game_Graphics_Mode.Counterfactual_World_Choice:
            case Game_Graphics_Mode.Vacuous_World_Choice:
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
                                this.animate_move(this.next_state, this.next_move, (this.next_move.get_world_input_requirement()) ? this.get_world_choice() : undefined);
                            } else {
                                this.set_formula(this.next_state, this.next_formula);
                            }
                            break;
                        case Game_Graphics_Mode.Formula_Choice:
                            this.set_choice(this.next_state, this.next_option1, this.next_option2);
                            break;
                        case Game_Graphics_Mode.Possibility_World_Choice:
                        case Game_Graphics_Mode.Necessity_World_Choice:
                        case Game_Graphics_Mode.Sphere_Selection:
                        case Game_Graphics_Mode.Counterfactual_World_Choice:
                        case Game_Graphics_Mode.Vacuous_World_Choice:
                            this.set_world_choice((this.next_option2 == undefined) ? [this.next_option1] : [this.next_option1, this.next_option2]);
                            break;
                    }
                }
                break;
        }
        this.sup_panel.update();
    }

    set_world_choice(moves: Rule[]) {
        let mode = world_choice_moves_to_mode(moves);
        if(this.mode != mode) {
            console.log("> transitioning to World_Choice");
            this.next_option1 = moves[0];
            this.next_option2 = moves[1];
            this.transition_mode(mode);
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        this.sup_panel.set_caption("Choose a reachable world:", Text_Animation.PULSE);
        this.ready = false;
    }

    set_choice(state: Game_State, option1: Rule, option2: Rule) {
        let is_cf_choice = (state.get_formula() instanceof Cf_Would) || (state.get_formula().get_child("l") instanceof Cf_Would);
        let mode = Game_Graphics_Mode.Formula_Choice;

        if(this.mode != mode) {
            console.log("> transitioning to "+Game_Graphics_Mode[mode]);
            this.next_option1 = option1;
            this.next_option2 = option2;
            this.next_state = state;
            this.transition_mode(mode);
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        switch(mode) {
            case Game_Graphics_Mode.Formula_Choice:
                this.sup_panel.set_caption("Choose next instructions:", Text_Animation.PULSE);
                this.sup_panel.transition(option1.get_acting_player());
                this.choice.set(state, option1, option2, this.formula.get_embedding_depth());
                break;
        }
        this.ready = false;
    }

    set_formula(state: Game_State, formula: Formula) {
        if(this.mode != Game_Graphics_Mode.Formula) {
            console.log("> transitioning to Formula");
            this.next_formula = formula;
            this.next_state = state;
            this.next_animate = false;
            this.transition_mode(Game_Graphics_Mode.Formula);
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        console.log("> setting formula " + formula.to_string());
        this.formula.set_formula(formula);
        (state.get_mode() == State_Mode.Counterfactual) ? this.graph_graphics.set_delim_world(state.get_delim_world().index) : this.graph_graphics.clear_delim_world();
        //this.graph_graphics.set_sphere(state.get_current_world().index, ((state.get_mode() == State_Mode.Counterfactual) ? state.get_radius() : undefined));
    }

    animate_move(state: Game_State, move: Rule, delim_world?: integer) {
        if(this.mode != Game_Graphics_Mode.Formula) {
            this.transition_mode(Game_Graphics_Mode.Formula);
            this.next_move = move;
            this.next_state = state;
            this.next_animate = true;
            if(this.mode == Game_Graphics_Mode.Transition) { return };
        }
        this.sup_panel.set_caption(describe_move(move), (move.get_name() == Rules.Defender_Victory) ? Text_Animation.PULSE : Text_Animation.NONE);
        let applied = move.apply(state, delim_world);
        console.log("> animating move " + Rules[move.get_name()] + " => " + applied.get_formula().to_string());
        this.idle(this.formula.animate(applied.get_formula(), move.get_name()));
        this.sup_panel.animate(move);

        if(applied.get_mode() == State_Mode.Counterfactual) {
            this.graph_graphics.set_delim_world(applied.get_delim_world().index);
        } else {
            this.graph_graphics.clear_delim_world();
            this.graph_graphics.clear_hints();
        }
        this.graph_graphics.set_sphere(applied.get_current_world().index, (applied.has_radius()) ? applied.get_delim_world().index : undefined, (applied.has_radius()) ? applied.get_radius() : undefined, move.get_name() == Rules.Attacker_Would_Sphere_Selection || move.get_name() == Rules.Defender_Would_Sphere_Selection || move.get_name() == Rules.Attacker_Might_Sphere_Selection || move.get_name() == Rules.Defender_Might_Sphere_Selection);
        if(move.get_name() == Rules.Attacker_Would_Sphere_Selection) { this.graph_graphics.set_would_hints(delim_world!); }
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
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Sphere_Selection:
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Counterfactual_World_Choice:
                console.log("> animating transition Formula -> "+Game_Graphics_Mode[this.next_mode]);
                this.idle(this.formula.animate_transition([old_mode, this.next_mode]));

                // TODO: Different vacuous button text for each mode
                /* this.vacuous.setInteractive();
                this.scene.add.tween({
                    targets: this.vacuous,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                }); */
                this.graph_graphics.animate(this.next_mode);
                return;
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Possibility_World_Choice:
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Necessity_World_Choice:
            case old_mode == Game_Graphics_Mode.Formula && this.next_mode == Game_Graphics_Mode.Vacuous_World_Choice:
                console.log("> animating transition Formula -> "+Game_Graphics_Mode[this.next_mode]);
                this.idle(this.formula.animate_transition([old_mode, this.next_mode]));
                this.graph_graphics.animate(this.next_mode);
                this.sup_panel.transition(Player.Defender);
                return;
            case old_mode == Game_Graphics_Mode.Sphere_Selection && this.next_mode == Game_Graphics_Mode.Formula:
            case old_mode == Game_Graphics_Mode.Counterfactual_World_Choice && this.next_mode == Game_Graphics_Mode.Formula:
                console.log("> animating transition "+Game_Graphics_Mode[old_mode]+" -> Formula");
                this.graph_graphics.stop_animation();
                this.graph_graphics.clear_hover_ellipse_alphas();
                /* this.vacuous.disableInteractive();
                this.scene.add.tween({
                    targets: this.vacuous,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                }); */
                this.set_mode(this.next_mode);
                return;
            case old_mode == Game_Graphics_Mode.Possibility_World_Choice && this.next_mode == Game_Graphics_Mode.Formula:
            case old_mode == Game_Graphics_Mode.Necessity_World_Choice && this.next_mode == Game_Graphics_Mode.Formula:
                console.log("> animating transition "+Game_Graphics_Mode[old_mode]+" -> Formula");
                this.graph_graphics.stop_animation();
                this.graph_graphics.clear_hover_ellipse_alphas();
                this.idle(this.formula.animate_transition([old_mode, this.next_mode]));
                break;
            case old_mode == Game_Graphics_Mode.Vacuous_World_Choice && this.next_mode == Game_Graphics_Mode.Formula:
                console.log("> animating transition "+Game_Graphics_Mode[old_mode]+" -> Formula");
                this.graph_graphics.stop_animation();
                this.graph_graphics.clear_hover_ellipse_alphas();
                this.set_mode(this.next_mode);
                break;
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
                this.formula.setVisible(false);
                this.choice.set_visible(true);
                this.graph_graphics.set_mode(Graph_Graphics_Mode.Display);
                break;
            case Game_Graphics_Mode.Possibility_World_Choice:
            case Game_Graphics_Mode.Necessity_World_Choice:
                this.formula.setVisible(true);
                this.choice.set_visible(false);
                this.graph_graphics.set_mode(Graph_Graphics_Mode.World_Choice);
                break;
            case Game_Graphics_Mode.Sphere_Selection:
                this.formula.setVisible(true);
                this.choice.set_visible(false);
                this.graph_graphics.set_mode(Graph_Graphics_Mode.Might_World_Choice);
                break;
            case Game_Graphics_Mode.Counterfactual_World_Choice:
            case Game_Graphics_Mode.Vacuous_World_Choice:
                this.formula.setVisible(true);
                this.choice.set_visible(false);
                this.graph_graphics.set_mode(Graph_Graphics_Mode.Would_World_Choice);
                break;
        }
    }

    set_vacuous_text(label: string) {
        this.vacuous.getElement('text').setText(label);
    }

    set_vacuous_icon(texture_key: string) {
        this.vacuous.getElement('icon').setTexture(texture_key);
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
        return (this.graph_graphics.is_choice_made()) ? this.graph_graphics.get_chosen_world() : -1;
    }

    get_formula_graphics(): Formula_Graphics {
        return this.formula;
    }

    get_choice_controller(): Choice {
        return this.choice;
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

    private create_help(scene: Base_Scene, x, y, rules_column: Rules_Column, text_box: Text_Box_Controller) {
        var button = scene.rexUI.add.label({
            width: 60,
            height: 60,

            orientation: 0,

            icon: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "help_icon").setDisplaySize(40, 40).setAlpha(0.6)),

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
            //text_box.deactivate();
            rules_column.set_visible(true);
        })
        buttons.on('button.out', function(button, index, pointer, event) {
            button.getElement('icon').setAlpha(0.6);
            //text_box.activate();
            rules_column.set_visible(false);
        })

        return buttons;
    }

    private create_vacuous(scene, label, x, y) {
        var button = scene.rexUI.add.label({
            width: 120,
            height: 60,

            orientation: 0,

            background: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "chunk").setDisplayOrigin(0.5, 0.5)),

            icon: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "none").setDisplaySize(40, 40).setDisplayOrigin(0.5, 0.5)),

            space: {
                left: 40,
                right: 0,
                top: 0,
                bottom: 0,
            }
        });

        var buttons = scene.rexUI.add.buttons({
            x: x,
            y: y,
            buttons: [],
        })
        .addButton(button)
        .layout();
    
        buttons.on('button.over', function(button, index, pointer, event) {
            button.getElement('background').setTexture("chunk_hover");
            button.getElement('background').setDisplayOrigin(0.5, 0.5);
        })
        buttons.on('button.out', function(button, index, pointer, event) {
            button.getElement('background').setTexture("chunk");
            button.getElement('background').setDisplayOrigin(0.5, 0.5);
        })
        buttons.on('button.click', function(button, index, pointer, event) {
            scene.graphics_controller.ready = true;
        })

        return button;
    }

    private create_button(scene, label, x, y) {
        var button = scene.rexUI.add.label({
            width: 120,
            height: 60,

            orientation: 0,

            background: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "chunk")),

            text: scene.add.text(0, 0, label, text_style),

            space: {
                left: 20,
                right: 0,
                top: 0,
                bottom: 0,
            }
        });

        var buttons = scene.rexUI.add.buttons({
            x: x,
            y: y,
            buttons: [],
        })
        .addButton(button)
        .layout();
    
        buttons.on('button.over', function(button, index, pointer, event) {
            button.getElement('background').setTexture("chunk_hover");
        })
        buttons.on('button.out', function(button, index, pointer, event) {
            button.getElement('background').setTexture("chunk");
        })
        buttons.on('button.click', function(button, index, pointer, event) {
            scene.graphics_controller.ready = true;
        })

        return button;
    }

    static load_sprites(scene: Phaser.Scene) {
        Graph_Graphics.load_sprites(scene);
        Formula_Graphics.load_sprites(scene);
        Rules_Column.load_sprites(scene);
        Text_Box_Controller.load_sprites(scene);
        Choice.load_sprites(scene);
        Supposition_Panel.load_sprites(scene);
        Icon_Text.load_sprites(scene);

        Star.load_sprites(scene);
        let level = (scene as Game_Scene).get_level();
        /* if(!scene.textures.getTextureKeys().includes("space"+level)) {
            create_cosmic_nebula_texture(scene, 1600, 1600, "space"+level);
            dye_texture(scene, "space"+level, 0x4C6793);
        } */
        if(!scene.textures.getTextureKeys().includes("space"+(level % 10))) {
            scene.load.image("space"+(level % 10), "assets/backgrounds/Background"+(level % 10)+".png");
        }

        scene.load.image("none", "assets/None.png");
        scene.load.image("back_panel", "assets/Slant_Right.png");
        scene.load.image("back_border", "assets/Slant_Right_Border.png");
        scene.load.image("back_fill", "assets/Slant_Right_Fill.png");
        scene.load.image("chunk", "assets/Small_Chunk.png");
        scene.load.image("chunk_hover", "assets/Small_Chunk_Hover.png");

        scene.load.image("help_icon", "assets/Help_Icon.png");
    }

    static configure_sprites(scene: Phaser.Scene) {
        Formula_Graphics.configure_sprites(scene);
        Graph_Graphics.configure_sprites(scene);
        Star.configure_sprites(scene);
    }
}
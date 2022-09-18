import { Rule, Rules } from "../game/Game_Rules";
import { Game_State } from "../game/Game_State";
import GameScene from "../scenes/Game";
import Base_Scene from "../util/Base_Scene";
import { Formula } from "../util/Cf_Logic";
import { Game_Graphics_Mode, text_style } from "../util/UI_Utils";
import { Choice_Animations } from "./animations/Choice_Animations";
import { Formula_Graphics, Formula_Graphics_Element } from "./Formula_Graphics";

export const OR_WIDTH = 60;
export const OPTION_BOX_HOVER = 130/255;
export const OPTION_BOX_OUT = 30/255;

export class Choice {
    private scene: Phaser.Scene;
    private or: Phaser.GameObjects.Text;
    private option1: Formula_Graphics;
    private option2: Formula_Graphics;

    private state!: Game_State; // TODO: not nice compiler error suppression
    private rule1!: Rule;
    private rule2!: Rule;

    private option1_box: Phaser.GameObjects.Rectangle;
    private option2_box: Phaser.GameObjects.Rectangle;

    private x: number;
    private y: number;

    private choice_made: boolean = false;
    private choice!: integer; // TODO: maybe find better way of suppressing initiaization compiler error
    private cf_choice: boolean = false;

    constructor(scene: Phaser.Scene, state?: Game_State, option1?: Rule, option2?: Rule, embedding_depth: integer = 0) {
        this.scene = scene;
        this.x = (scene as GameScene).get_width()/2;
        this.y = (scene as GameScene).get_height() - 100;

        let x = this.x;
        let y = this.y;

        let formula1 = Formula.parse("_|_");
        let formula2 = Formula.parse("~_|_");
        let atoms: string[] = [];
        if(state != undefined && option1 != undefined && option2 != undefined) {
            formula1 = option1.apply(state).get_formula();
            formula2 = option2.apply(state).get_formula();
            atoms = state.get_atoms();

            this.state = state;
            this.rule1 = option1;
            this.rule2 = option2;
        }

        this.or = new Phaser.GameObjects.Text(scene, x, y, "OR", text_style);
        this.option1 = new Formula_Graphics(scene as Base_Scene, x, y, formula1, atoms, embedding_depth).setDepth(1);
        this.option2 = new Formula_Graphics(scene as Base_Scene, x, y, formula2, atoms, embedding_depth).setDepth(1);
        this.option1.setX(this.option1.x - 25 - this.option1.get_width()/2);
        this.option2.setX(this.option2.x + 25 + this.option2.get_width()/2);

        this.option1_box = new Phaser.GameObjects.Rectangle(scene, x - 25 - this.option1.get_width()/2, y, 250, 100, 0xffffff);
        this.option2_box = new Phaser.GameObjects.Rectangle(scene, x + 25 + this.option2.get_width()/2, y, 250, 100, 0xffffff);
        this.option1_box.setAlpha(OPTION_BOX_OUT);
        this.option2_box.setAlpha(OPTION_BOX_OUT);

        this.option1_box.setInteractive();
        this.option1_box.on('pointerup', () => {
            this.choice_made = true;
            this.choice = 0;
            this.option1_box.disableInteractive();
            this.option2_box.disableInteractive();
        });
        this.option1_box.on('pointerover', () => { this.option1_box.setAlpha(OPTION_BOX_HOVER); });
        this.option1_box.on('pointerout', () => { this.option1_box.setAlpha(OPTION_BOX_OUT); });

        this.option2_box.setInteractive();
        this.option2_box.on('pointerup', () => {
            this.choice_made = true;
            this.choice = 1;
            this.option1_box.disableInteractive();
            this.option2_box.disableInteractive();
        });
        this.option2_box.on('pointerover', () => { this.option2_box.setAlpha(OPTION_BOX_HOVER); });
        this.option2_box.on('pointerout', () => { this.option2_box.setAlpha(OPTION_BOX_OUT); });
    }

    add_to_scene() {
        this.scene.children.add(this.or);
        this.or.setOrigin(0.5, 0.5);

        this.scene.children.add(this.option1);
        this.scene.children.add(this.option2);

        this.scene.children.add(this.option1_box);
        this.scene.children.add(this.option2_box);
    }

    set(state: Game_State, option1: Rule, option2: Rule, embedding_depth: integer = 0) {
        this.cf_choice = false;
        this.choice_made = false;
        this.set_visible(true);
        this.state = state;
        this.rule1 = option1;
        this.rule2 = option2;


        let atoms = state.get_atoms();
        this.option1.set_atoms(atoms);
        this.option2.set_atoms(atoms);
        this.option1.set_embedding_depth(embedding_depth +  1);
        this.option2.set_embedding_depth(embedding_depth + 1);
        this.option1.set_formula(option1.apply(this.state).get_formula());
        this.option2.set_formula(option2.apply(this.state).get_formula());

        let w1 = this.option1.get_width();
        let w2 = this.option2.get_width();
        this.option1.setX(this.x - OR_WIDTH/2 - w1/2);
        this.option2.setX(this.x + OR_WIDTH/2 + w2/2);

        this.option1_box.setX(this.x - OR_WIDTH/2 - w1/2);
        this.option2_box.setX(this.x + OR_WIDTH/2 + w2/2);
        this.option1_box.displayWidth = 1;
        this.option2_box.displayWidth = 1;
        this.or.setScale(0.1, 0.1);

        this.or.setAlpha(0);
        this.option1.setAlpha(1);
        this.option2.setAlpha(1);
        this.option1_box.setAlpha(0);
        this.option2_box.setAlpha(0);

        let timeline = this.scene.tweens.createTimeline();
        Choice_Animations.fill_popup_animation_timeline(timeline, this);
        timeline.play();

        this.option1_box.setInteractive();
        this.option2_box.setInteractive();
    }

    set_cf(state: Game_State, option1: Rule, option2: Rule, embedding_depth: integer = 0, delim_world?: integer) {
        this.cf_choice = true;
        this.choice_made = false;
        this.set_visible(true);
        this.state = state;
        this.rule1 = option1;
        this.rule2 = option2;


        let atoms = state.get_atoms();
        this.option1.set_atoms(atoms);
        this.option2.set_atoms(atoms);
        this.option1.set_embedding_depth(embedding_depth + 1);
        this.option2.set_embedding_depth(embedding_depth);
        this.option1.set_formula(option1.apply(this.state).get_formula());
        this.option2.set_formula(option2.apply(this.state, delim_world).get_formula());

        let w1 = this.option1.get_width();
        let w2 = this.option2.get_width();
        this.option1.setX(this.x - OR_WIDTH/2 - w1/2);
        this.option2.setX(this.x + OR_WIDTH/2 + w2/2);

        this.option1_box.setX(this.x - OR_WIDTH/2 - w1/2);
        this.option2_box.setX(this.x + OR_WIDTH/2 + w2/2);
        this.option1_box.displayWidth = 1;
        this.option2_box.displayWidth = 1;
        this.or.setScale(0.1, 0.1);

        this.or.setAlpha(0);
        this.option1.setAlpha(0);
        this.option2.setAlpha(1);
        this.option1_box.setAlpha(0);
        this.option2_box.setAlpha(0);

        let timeline = this.scene.tweens.createTimeline();
        Choice_Animations.fill_cf_popup_animation_timeline(timeline, this);
        timeline.play();

        this.option1_box.setInteractive();
        this.option2_box.setInteractive();
    }

    animate_transition(transition: [Game_Graphics_Mode, Game_Graphics_Mode]): number {
        let timeline = this.scene.tweens.createTimeline();
        let anim_time = Choice_Animations.fill_transition_animation_timeline(timeline, transition, this);
        timeline.play();
        return anim_time;
    }

    resize() {
        let w = (this.scene as Base_Scene).get_width();
        let h = (this.scene as Base_Scene).get_height();
        let w1 = this.option1.get_width();
        let w2 = this.option2.get_width();

        this.or.setX(w/2);
        this.option1.setX(w/2 - OR_WIDTH/2 - w1/2);
        this.option1_box.setX(w/2 - OR_WIDTH/2 - w1/2);
        this.option2.setX(w/2 + OR_WIDTH/2 + w2/2);
        this.option2_box.setX(w/2 + OR_WIDTH/2 + w2/2);

        this.or.setY(h-100);
        this.option1.setY(h-100);
        this.option1_box.setY(h-100);
        this.option2.setY(h-100);
        this.option2_box.setY(h-100);
    }

    set_visible(visible: boolean) {
        this.option1.setVisible(visible);
        this.option2.setVisible(visible);
        this.option1_box.setVisible(visible);
        this.option2_box.setVisible(visible);
        this.or.setVisible(visible);
    }

    destroy() {
        this.option1.destroy(true);
        this.option2.destroy(true);
        this.option1_box.destroy(true);
        this.option2_box.destroy(true);
        this.or.destroy();
    }

    get_x(): number {
        return this.x;
    }

    get_y(): number {
        return this.y;
    }

    get_or(): Phaser.GameObjects.Text {
        return this.or;
    }

    get_option_boxes(): Phaser.GameObjects.Rectangle[] {
        return [this.option1_box, this.option2_box];
    }

    get_option_graphic(index: number): Formula_Graphics {
        return (index == 0) ? this.option1 : this.option2;
    }

    get_choice(): Rule {
        if(!this.is_choice_made) { throw new Error("Cannot get Choice, when nothing has been chosen"); }
        return (this.choice == 0) ? this.rule1 : this.rule2;
    }

    get_chosen_graphic(): Formula_Graphics {
        if(!this.is_choice_made) { throw new Error("Cannot get Choice, when nothing has been chosen"); }
        return (this.choice == 0) ? this.option1 : this.option2;
    }

    get_not_chosen_graphics(): Formula_Graphics {
        if(!this.is_choice_made) { throw new Error("Cannot get what hasnt been chosen, when nothing has been chosen"); }
        return (this.choice == 0) ? this.option2 : this.option1;
    }

    is_choice_made(): boolean {
        return this.choice_made;
    }

    is_cf_choice(): boolean {
        return this.cf_choice;
    }
}
import { Rule } from "../game/Game_Rules";
import { Game_State } from "../game/Game_State";
import GameScene from "../scenes/Game";
import { Formula } from "../util/Cf_Logic";
import { text_style } from "../util/UI_Utils";
import { Cf_Logic_Graphics } from "./Cf_Logic_Graphics";

export class Choice {
    private scene: Phaser.Scene;
    private or: Phaser.GameObjects.Text;
    private option1: Cf_Logic_Graphics;
    private option2: Cf_Logic_Graphics;

    private state!: Game_State; // TODO: not nice compiler error suppression
    private rule1!: Rule;
    private rule2!: Rule;

    private option1_box: Phaser.GameObjects.Rectangle;
    private option2_box: Phaser.GameObjects.Rectangle;

    private x: number;
    private y: number;

    private choice_made: boolean = false;
    private choice!: Rule; // TODO: maybe find better way of suppressing initiaization compiler error

    constructor(scene: Phaser.Scene, state?: Game_State, option1?: Rule, option2?: Rule) {
        this.scene = scene;
        this.x = (scene as GameScene).get_width()/2;
        this.y = (scene as GameScene).get_height() - 100;

        let x = this.x;
        let y = this.y;

        let formula1 = Formula.parse("_|_");
        let formula2 = Formula.parse("~_|_");
        if(state != undefined && option1 != undefined && option2 != undefined) {
            formula1 = option1.apply(state).get_formula();
            formula2 = option2.apply(state).get_formula();

            this.state = state;
            this.rule1 = option1;
            this.rule2 = option2;
        }

        this.or = new Phaser.GameObjects.Text(scene, x, 500, "OR", text_style);
        this.option1 = new Cf_Logic_Graphics(scene, formula1, x - 150, y);
        this.option2 = new Cf_Logic_Graphics(scene, formula2, x + 150, y);

        this.option1_box = new Phaser.GameObjects.Rectangle(scene, x - 150, y, 250, 100, 0xffffff, 192);
        this.option2_box = new Phaser.GameObjects.Rectangle(scene, x + 150, y, 250, 100, 0xffffff, 192);

        this.option1_box.setInteractive();
        this.option1_box.on('pointerup', () => {
            this.choice_made = true;
            this.choice = this.rule1;
            this.set_visible(false);
            this.option1.setX(this.x);
            this.option1.setVisible(true);
        });
        this.option1_box.on('pointerover', () => { this.option1_box.fillAlpha = 128; });
        this.option1_box.on('pointerout', () => { this.option1_box.fillAlpha = 192; });

        this.option2_box.setInteractive();
        this.option2_box.on('pointerup', () => {
            this.choice_made = true;
            this.choice = this.rule2;
            this.set_visible(false);
            this.option2.setX(this.x);
            this.option2.setVisible(true);
        });
        this.option2_box.on('pointerover', () => { this.option2_box.fillAlpha = 128; });
        this.option2_box.on('pointerout', () => { this.option2_box.fillAlpha = 192; });
    }

    add_to_scene() {
        this.scene.children.add(this.or);
        this.or.setOrigin(0.5, 0.5);

        this.scene.children.add(this.option1);
        this.scene.children.add(this.option2);

        this.scene.children.add(this.option1_box);
        this.scene.children.add(this.option2_box);
    }

    set(state: Game_State, option1: Rule, option2: Rule, atoms?: string[]) {
        this.choice_made = false;
        this.set_visible(true);
        this.state = state;
        this.rule1 = option1;
        this.rule2 = option2;

        this.option1.setX(this.x - 150);
        this.option2.setX(this.x + 150);
        this.option1.set_formula(option1.apply(this.state).get_formula().to_string(atoms));
        this.option2.set_formula(option2.apply(this.state).get_formula().to_string(atoms));
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

    get_choice(): Rule {
        if(!this.is_choice_made) { throw new Error("Cannot get Choice, when nothing has been chosen"); }
        return this.choice;
    }

    is_choice_made(): boolean {
        return this.choice_made;
    }
}
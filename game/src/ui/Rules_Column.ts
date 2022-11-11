import Base_Scene from "../util/Base_Scene";
import { linebreaks, text_style } from "../util/UI_Utils";
import { get_rule_explanations } from "./data/Rule_Explanations";
import { BRACKET_WIDTH, ICON_WIDTH } from "./Formula_Graphics";
import { Rule_Graphics } from "./Rule_Graphics";

const PROXY_ATOMS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLUMN_OFFSET = (7*ICON_WIDTH)/2;

export enum Rules_Column_Mode {
    RIGHT,
    BOTH
}

export class Rules_Column {
    private scene: Phaser.Scene;
    private left_column: Phaser.GameObjects.Sprite[] = [];
    private right_column: Phaser.GameObjects.Sprite[] = [];
    private rules: Rule_Graphics[] = [];
    private rule_descriptions: Phaser.GameObjects.Text[] = [];
    private mode: Rules_Column_Mode = Rules_Column_Mode.RIGHT;

    constructor(scene: Base_Scene, x: number, y: number, formula: string) {
        this.scene = scene;

        let exptup = get_rule_explanations(formula, PROXY_ATOMS);
        let preformulas = exptup[0];
        let postformulas = exptup[1];
        let descriptions = exptup[2];

        let right_height = this.calc_height(exptup, 5);
        let left_height = this.calc_height(exptup, 10) - right_height;

        this.left_column.push(new Phaser.GameObjects.Sprite(scene, 210, y+20, "ext_rule_column_top").setVisible(false));
        this.left_column.push(new Phaser.GameObjects.Sprite(scene, 210, y+40+left_height/2-10, "ext_rule_column_mid").setDisplaySize(420, left_height-20).setVisible(false));
        this.left_column.push(new Phaser.GameObjects.Sprite(scene, 210, y+40+left_height-20+20, "ext_rule_column_bot").setVisible(false));

        this.right_column.push(new Phaser.GameObjects.Sprite(scene, x, y+20, "rule_column_top"));
        this.right_column.push(new Phaser.GameObjects.Sprite(scene, x, y+40+right_height/2-10, "rule_column_mid").setDisplaySize(360, right_height-20));
        this.right_column.push(new Phaser.GameObjects.Sprite(scene, x, y+40+right_height-20+20, "rule_column_bot"));
        let xpos = x;
        let ypos = y + 30;
        

        if(preformulas.length > 5) {
            this.mode = Rules_Column_Mode.BOTH;
            this.left_column[0].setVisible(true);
            this.left_column[1].setVisible(true);
            this.left_column[2].setVisible(true);
        }


        for(let i=0; i<preformulas.length; i++) {
            ypos += postformulas[i].length*ICON_WIDTH/2;
            let rule = new Rule_Graphics(scene, xpos, ypos, preformulas[i], postformulas[i], PROXY_ATOMS, (preformulas[i] == "A |_|-> B" || preformulas[i] == "A ⩽⩾-> B") ? 0.7 : 0.9);
            if(preformulas[i] == "¯|¯") { rule.get_postformulas()[0].get_formula().setTexture("win"); }
            if(preformulas[i] == "_|_") { rule.get_postformulas()[0].get_formula().setTexture("loss"); }
            this.rules.push(rule);
            ypos += postformulas[i].length*ICON_WIDTH/2;

            let text_off = (linebreaks(descriptions[i]) + 1)*15 + 10;
            let description = new Phaser.GameObjects.Text(scene, xpos, ypos + text_off/2, descriptions[i], text_style);
            description.setOrigin(0.5, 0.5);
            this.rule_descriptions.push(description);
            ypos += text_off + 10;

            // Jump to start of next column
            if(i==4) {
                xpos = 210;//scene.get_width() - x + 30;
                ypos = y + 30;
            }
        }
    }

    add_to_scene() {
        for(let i=0; i<this.rules.length; i++) {
            this.rules[i].add_to_scene();
            this.scene.children.add(this.rule_descriptions[i]);
        }
        this.scene.add.existing(this.left_column[0]);
        this.scene.add.existing(this.left_column[1]);
        this.scene.add.existing(this.left_column[2]);
        this.scene.add.existing(this.right_column[0]);
        this.scene.add.existing(this.right_column[1]);
        this.scene.add.existing(this.right_column[2]);
    }

    set_visible(visible: boolean) {
        if(this.mode == Rules_Column_Mode.BOTH) {
            this.left_column[0].setVisible(visible);
            this.left_column[1].setVisible(visible);
            this.left_column[2].setVisible(visible);
        }
        this.right_column[0].setVisible(visible);
        this.right_column[1].setVisible(visible);
        this.right_column[2].setVisible(visible);
        for(let i=0; i<this.rules.length; i++) {
            this.rules[i].set_visible(visible);
            this.rule_descriptions[i].setVisible(visible);
        }
    }

    static load_sprites(scene: Phaser.Scene) {
        scene.load.image("rule_column", "assets/Corner_Free_Column.png");
        scene.load.image("rule_column_top", "assets/Corner_Free_Column_Top.png");
        scene.load.image("rule_column_mid", "assets/Corner_Free_Column_Mid.png");
        scene.load.image("rule_column_bot", "assets/Corner_Free_Column_Bot.png");
        scene.load.image("ext_rule_column", "assets/Left_Corner_Free_Column.png");
        scene.load.image("ext_rule_column_top", "assets/Left_Corner_Free_Column_Top.png");
        scene.load.image("ext_rule_column_mid", "assets/Left_Corner_Free_Column_Mid.png");
        scene.load.image("ext_rule_column_bot", "assets/Left_Corner_Free_Column_Bot.png");
        scene.load.image("vignette", "assets/Solid_Giant_Chunk.png");
        scene.load.image("giant_chunk", "assets/Giant_Chunk.png");
    }

    private calc_height(exptup: [string[], string[][], string[]], limit: number): number {
        let sum = 0;
        for(let i=0; i<exptup[2].length && i<limit; i++) {
            sum += exptup[1][i].length*ICON_WIDTH + (linebreaks(exptup[2][i]) + 1)*15 + 20;
        }
        return sum;
    }
}
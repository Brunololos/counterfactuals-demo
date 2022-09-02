import { Rule } from "../game/Game_Rules";
import { Formula } from "../util/Cf_Logic";
import { Utils } from "../util/Utils";

export class Cf_Logic_Graphics extends Phaser.GameObjects.Container {
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, formula: Formula, x: number, y: number) {
        super(scene, x, y);
        this.text = new Phaser.GameObjects.Text(scene, 0, 0, formula.to_string(), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        //this.text.setStroke("0xff00ff", 5);
        this.text.setColor("0xC21010");
        this.text.setOrigin(0.5, 0.5);
        this.add(this.text);
        //this.add(new Phaser.GameObjects.Ellipse(scene, 0, 0, 5, 5, 0xff7777));
    }

    animate(formula: Formula, atoms?: string[]): integer {
        this.text.text = formula.to_string(atoms);
        return 2000;
    }

    set_formula(formula: string) {
        this.text.text = formula;
    }
}
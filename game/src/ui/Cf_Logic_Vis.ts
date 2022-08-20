import { Utils } from "../util/Utils";

export class Cf_Logic_Vis extends Phaser.GameObjects.Container {
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, formula: string, x: number, y: number) {
        super(scene, x, y);
        this.text = new Phaser.GameObjects.Text(scene, 0, 0, formula, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        //this.text.setStroke("0xff00ff", 5);
        this.text.setColor("0xC21010");
        this.add(this.text);
    }

    animate(formula: string) {
        Utils.sleep(2000);
        this.text.text = formula;
    }
}
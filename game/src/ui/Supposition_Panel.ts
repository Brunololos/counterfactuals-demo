import Game_Scene from "../scenes/Game";
import Base_Scene from "../util/Base_Scene";

export class Supposition_Panel extends Phaser.GameObjects.Container {
    private contents: Phaser.GameObjects.GameObject[] = [];

    constructor(scene: Base_Scene, x: number, y: number, content?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y);
        this.contents = this.contents.concat(content || this.contents);
        let w = (scene as Game_Scene).get_width();
        let h = (this.scene as Base_Scene).get_height();
        let rect = new Phaser.GameObjects.Rectangle(scene, 0, 0, w, 200, 0x7893AD);
        this.add(rect);
        //this.add(new Phaser.GameObjects.Ellipse(scene, 0, 0, 5, 5, 0xCC3636).setDepth(1));
    }

    /**
     * Discard the contents of the panel
     */
    discard() {
        // TODO: Empty contents + play discard animation
    }

    /**
     * Embed a new Object within the panel
     */
    embed(object: Phaser.GameObjects.GameObject) {
        // TODO: add object to children + play pop up animation
        this.contents.push(object);
    }

    resize() {
        let w = (this.scene as Base_Scene).get_width();
        let h = (this.scene as Base_Scene).get_height();
        (this.getAt(0) as Phaser.GameObjects.Rectangle).setDisplaySize(w, 200);
        this.setX(w/2);
        this.setY(h-100);
    }
}
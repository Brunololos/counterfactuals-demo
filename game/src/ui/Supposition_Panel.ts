import GameScene from "../scenes/Game";

export class Supposition_Panel extends Phaser.GameObjects.Container {
    private contents: Phaser.GameObjects.GameObject[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, content?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y);
        this.contents = this.contents.concat(content || this.contents);
        // TODO: add visual representation of the panel
        let w = (scene as GameScene).get_width();
        let rect = new Phaser.GameObjects.Rectangle(scene, 0, 0, w, 200, 0xF1A661);
        this.add(rect);
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
}
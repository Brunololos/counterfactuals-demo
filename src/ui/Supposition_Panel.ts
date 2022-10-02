import Game_Scene from "../scenes/Game";
import Base_Scene from "../util/Base_Scene";

export class Supposition_Panel extends Phaser.GameObjects.Container {
    private contents: Phaser.GameObjects.GameObject[] = [];

    constructor(scene: Base_Scene, x: number, y: number, content?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y);
        this.contents = this.contents.concat(content || this.contents);
        let w = (scene as Game_Scene).get_width();
        let h = (this.scene as Base_Scene).get_height();
        let rect = new Phaser.GameObjects.Rectangle(scene, 0, 0, w*0.75, 200, 0x7893AD).setAlpha(0.8);
        //this.add(rect);
        let rect2 = new Phaser.GameObjects.Rectangle(scene, 0, 5, w*0.75-20, 190, 0x2f3943).setAlpha(0.8);
        //this.add(rect2);
        let panel = new Phaser.GameObjects.Sprite(scene, 0, 0, "sup_panel");//.setDisplaySize(w*0.75-20, 180);
        this.add(panel);
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

    static load_sprites(scene: Phaser.Scene) {
        //scene.load.image("sup_panel", "assets/SajShafiqueRoof_Alpha.png");
        scene.load.image("sup_panel", "assets/Banner_Slim_Shadow.png");
    }
}
import Game_Scene from "../scenes/Game";
import Base_Scene from "../util/Base_Scene";
import { banner_mask_path, create_shape_geometry_mask, text_style } from "../util/UI_Utils";
import { Text_Animation, Text_Animations } from "./animations/Text_Animations";

export class Supposition_Panel extends Phaser.GameObjects.Container {
    private contents: Phaser.GameObjects.GameObject[] = [];
    private caption: Phaser.GameObjects.Text;
    private caption_animation_timeline: Phaser.Tweens.Timeline;

    constructor(scene: Base_Scene, x: number, y: number, content?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y);
        this.contents = this.contents.concat(content || this.contents);
        let w = (scene as Game_Scene).get_width();
        let h = (this.scene as Base_Scene).get_height();

        let panel = new Phaser.GameObjects.Sprite(scene, 0, 5, "sup_panel");
        this.add(panel);
        let knob = new Phaser.GameObjects.Sprite(scene, 0, 80, "sup_panel_knob"); /* 90 */
        this.add(knob);
        this.caption = new Phaser.GameObjects.Text(scene, 0, -60, "Can you prove this?", text_style);
        this.caption.setOrigin(0.5, 0.5);
        this.add(this.caption);

        let mask = create_shape_geometry_mask(scene, x, y + 5, 900, 200, banner_mask_path);
        for(let i=0; content != undefined && i<content.length; i++) {
            (content[i] as Phaser.GameObjects.Container || Phaser.GameObjects.Sprite || Phaser.GameObjects.Rectangle).setMask(mask);
        }
        knob.setMask(mask);
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
        this.setX(w/2);
        this.setY(h-100);
    }

    animate_caption(animation: Text_Animation, timeout = -1) {
        if(this.caption_animation_timeline != undefined) {
            this.caption_animation_timeline.stop();
        }
        if(animation == Text_Animation.NONE) { return; }
        let timeline = this.scene.tweens.createTimeline({
            loop: -1,
            onUpdate: function() {
                if(timeout != -1 && timeline.totalElapsed >= timeout) {
                    console.log("stopping");
                    timeline.stop();
                }
            }
        });
        this.caption_animation_timeline = timeline;
        Text_Animations.fill_text_animation_timeline(timeline, this.caption, animation);
        timeline.play();
    }

    set_caption(caption: string, animation: Text_Animation = Text_Animation.NONE, timeout = -1) {
        this.caption.text = caption;
        this.caption.scale = 1;
        this.animate_caption(animation, timeout);
    }

    static load_sprites(scene: Phaser.Scene) {
        scene.load.image("sup_panel", "assets/Banner.png");
        scene.load.image("sup_panel_knob", "assets/Banner_Knob.png");
        scene.load.image("sup_panel_mask", "assets/Banner_Clip_Mask.png");
    }

    static createPanel = function (scene, content) {
        var sizer = scene.rexUI.add.sizer({
            orientation: 'x',
            anchor: {
                centerX: "center",
                centerY: "bottom-110"
            },
            space: { item: 10 }
        })
        for(let i=0; i<content.length; i++) {
            sizer.add(content[i])
        }
        return sizer;
    }
}
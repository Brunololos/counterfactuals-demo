import { Rule, Rules } from "../game/Game_Rules";
import Game_Scene from "../scenes/Game";
import Base_Scene from "../util/Base_Scene";
import { Player } from "../util/Game_Utils";
import { banner_mask_path, create_shape_geometry_mask, text_style } from "../util/UI_Utils";
import { Supposition_Panel_Animation, Supposition_Panel_Animations } from "./animations/Supposition_Panel_Animations";
import { Text_Animation, Text_Animations } from "./animations/Text_Animations";

export class Supposition_Panel extends Phaser.GameObjects.Container {
    private contents: Phaser.GameObjects.GameObject[] = [];
    private panel: Phaser.GameObjects.Sprite;
    private knob: Phaser.GameObjects.Sprite;

    private caption: Phaser.GameObjects.Text;
    private caption_animation_timeline: Phaser.Tweens.Timeline;

    private player_ind1: Phaser.GameObjects.Sprite;
    private player_ind2: Phaser.GameObjects.Sprite;

    private tween_dummy: Phaser.GameObjects.Sprite;
    private animation: Phaser.Tweens.Timeline;

    constructor(scene: Base_Scene, x: number, y: number, content?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y);
        this.contents = this.contents.concat(content || this.contents);
        let w = (scene as Game_Scene).get_width();
        let h = (this.scene as Base_Scene).get_height();

        this.panel = new Phaser.GameObjects.Sprite(scene, 0, 5, "sup_panel");
        this.add(this.panel);
        this.knob = new Phaser.GameObjects.Sprite(scene, 0, 80, "sup_panel_knob"); /* 90 */
        this.add(this.knob);
        this.caption = new Phaser.GameObjects.Text(scene, 0, -60, "Reach a habitable world", text_style);
        this.caption.setOrigin(0.5, 0.5);
        this.add(this.caption);

        this.player_ind1 = new Phaser.GameObjects.Sprite(scene, -215, -61, "pilot").setDisplaySize(25, 25).setTint(0x00dd00);
        this.player_ind2 = new Phaser.GameObjects.Sprite(scene, 215, -61, "pilot").setDisplaySize(25, 25).setTint(0x00dd00);
        this.add(this.player_ind1);
        this.add(this.player_ind2);

        let mask = create_shape_geometry_mask(scene, x, y + 5, 900, 200, banner_mask_path);
        for(let i=0; content != undefined && i<content.length; i++) {
            (content[i] as Phaser.GameObjects.Container || Phaser.GameObjects.Sprite || Phaser.GameObjects.Rectangle).setMask(mask);
        }
        this.knob.setMask(mask);

        this.tween_dummy = new Phaser.GameObjects.Sprite(scene, 0, 0, "dot").setVisible(false);


        /* var postFxPlugin = this.scene.rexGlowFilterPipeline;
        let gameObject = this.panel;

        gameObject
            .setInteractive()
            .on('pointerover', function () {

            // Add postfx pipeline
            var pipeline = postFxPlugin.add(gameObject);
            gameObject.glowTask = gameObject.scene.tweens.add({
                targets: pipeline,
                intensity: 0.02,
                ease: 'Quart.Out',
                duration: 1000,
                repeat: -1,
                yoyo: true
            });
        }) */
        // TODO: Glow effects
        /* var postFxPlugin = this.scene.rexGlowFilterPipeline;
        let gameObject = this.panel;

        // Add postfx pipeline
        var pipeline = postFxPlugin.add(gameObject);
        let timeline = this.scene.tweens.createTimeline({
            loop: -1
        });
        timeline.add({
            targets: pipeline,
            intensity: 0.02,
            ease: 'Quart.In',
            duration: 750,
            repeat: 0,
            yoyo: false
        });
        timeline.add({
            targets: pipeline,
            intensity: 0,
            ease: 'Quart.Out',
            duration: 750,
            repeat: 0,
            yoyo: false
        });


        gameObject
            .setInteractive()
            .on('pointerover', function () {
            gameObject.glowTask = timeline;
            timeline.play();
        }) */
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

    animate(move: Rule) {
        if(this.animation != undefined) { this.animation.stop(); }
        if(move.get_name() == Rules.Attacker_Victory) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Attacker_Victory);
        } else if(move.get_name() == Rules.Defender_Victory) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Defender_Victory);
        } else if(move.get_name() == Rules.Attacker_Negation) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Attacker_Shift_Switch);
        } else if(move.get_name() == Rules.Defender_Negation) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Defender_Shift_Switch);
        } else if(move.get_name() == Rules.Defender_Left_AND) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Defender_Left_AND);
        } else if(move.get_name() == Rules.Defender_Right_AND) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Defender_Right_AND);
        } else if(move.get_name() == Rules.Attacker_Necessity) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Attacker_Necessity);
        } else if(move.get_name() == Rules.Defender_Necessity) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Defender_Necessity);
        } else if(move.get_name() == Rules.Attacker_Might_Target_Evaluation) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Attacker_Might_Target_Evaluation);
        } else if(move.get_name() == Rules.Attacker_Might_Closer_Phi_World) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Attacker_Might_Closer_Phi_World);
        } else if(move.get_name() == Rules.Attacker_Would_Sphere_Selection) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Attacker_Would_Sphere_Selection);
        } else if(move.get_name() == Rules.Defender_Would_Sphere_Selection) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Defender_Would_Sphere_Selection);
        } else if(move.get_name() == Rules.Attacker_Vacuous_Would_Sphere_Selection) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Attacker_Vacuous_Would_Sphere_Selection);
        } else if(move.get_name() == Rules.Defender_Vacuous_Would_Sphere_Selection) {
            this.animation = Supposition_Panel_Animations.create(this.scene, this, Supposition_Panel_Animation.Defender_Vacuous_Would_Sphere_Selection);
        } else { return; }
        this.animation.play();
    }

    transition(player: Player) {
        if(this.animation != undefined) { this.animation.stop(); }
        this.animation = Supposition_Panel_Animations.create_transition(this.scene, this, player);
        this.animation.play();
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

    set_tint(color: number) {
        let children = this.getAll();
        for(let i=0; i<children.length; i++) {
            (children[i] as Phaser.GameObjects.Sprite).setTint(color);
        }
    }

    get_panel(): Phaser.GameObjects.Sprite {
        return this.panel;
    }

    get_knob(): Phaser.GameObjects.Sprite {
        return this.knob;
    }

    get_player_ind1(): Phaser.GameObjects.Sprite {
        return this.player_ind1;
    }

    get_player_ind2(): Phaser.GameObjects.Sprite {
        return this.player_ind2;
    }

    get_dummy(): Phaser.GameObjects.Sprite {
        return this.tween_dummy;
    }

    static load_sprites(scene: Phaser.Scene) {
        scene.load.image("sup_panel", "assets/Banner.png");
        scene.load.image("sup_panel_knob", "assets/Banner_Knob.png");
        scene.load.image("sup_panel_mask", "assets/Banner_Clip_Mask.png");
        scene.load.image("pilot", "assets/Pilot.png");
        //scene.load.image("copilot", "assets/Copilot.png");
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
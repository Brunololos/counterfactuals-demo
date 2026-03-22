import { Rule, Rules } from "../game/Game_Rules";
import Game_Scene from "../scenes/Game";
import Base_Scene from "../util/Base_Scene";
import { Player } from "../util/Game_Utils";
import { PLAYER_COLOR, COPILOT_COLOR, duplicate_texture, dye_texture, banner_mask_path, create_shape_geometry_mask, text_style } from "../util/UI_Utils";
import { Supposition_Panel_Animation, Supposition_Panel_Animations } from "./animations/Supposition_Panel_Animations";
import { Text_Animation, Text_Animations } from "./animations/Text_Animations";

export class Supposition_Panel extends Phaser.GameObjects.Container {
    private contents: Phaser.GameObjects.GameObject[] = [];
    private panel: Phaser.GameObjects.Sprite;

    // TODO:
    private activity_overlay: Phaser.GameObjects.Sprite;
    private activity_indl: Phaser.GameObjects.Sprite;
    private activity_indr: Phaser.GameObjects.Sprite;
    private formula_section_glow: Phaser.GameObjects.Sprite;
    private chamber_glowl: Phaser.GameObjects.Sprite;
    private chamber_glowr: Phaser.GameObjects.Sprite;
    // end temp testing

    private knob: Phaser.GameObjects.Sprite;
    private submask: Phaser.Display.Masks.GeometryMask;

    private caption: Phaser.GameObjects.Text;
    private caption_animation_timeline: Phaser.Tweens.Timeline;

    private player_indl: Phaser.GameObjects.Sprite;
    private player_indr: Phaser.GameObjects.Sprite;
    private player_indl_outline: Phaser.GameObjects.Sprite;
    private player_indr_outline: Phaser.GameObjects.Sprite;

    private tween_dummy: Phaser.GameObjects.Sprite;
    private animation: Phaser.Tweens.Timeline;

    constructor(scene: Base_Scene, x: number, y: number, content?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y);
        this.contents = this.contents.concat(content || this.contents);
        let w = (scene as Game_Scene).get_width();
        let h = (this.scene as Base_Scene).get_height();

        this.panel = new Phaser.GameObjects.Sprite(scene, 0, 5, "sup_panel");
        this.activity_overlay = new Phaser.GameObjects.Sprite(scene, 0, 5, "sup_panel_activity_overlay").setAlpha(1.0);
        this.activity_indl = new Phaser.GameObjects.Sprite(scene, -28, 81, "pilot_indicator").setAlpha(1.0);
        this.activity_indr = new Phaser.GameObjects.Sprite(scene, 28, 81, "copilot_indicator").setFlipX(true).setAlpha(0.0);
        this.formula_section_glow = new Phaser.GameObjects.Sprite(scene, 0, 5, "sup_panel_formula_section_glow").setAlpha(0.0).setTint(PLAYER_COLOR);
        this.chamber_glowl = new Phaser.GameObjects.Sprite(scene, 0, 5, "sup_panel_chamber_glow_left").setAlpha(0.75).setTint(PLAYER_COLOR);
        this.chamber_glowr = new Phaser.GameObjects.Sprite(scene, 0, 5, "sup_panel_chamber_glow_left").setFlipX(true).setAlpha(0.75).setTint(COPILOT_COLOR);

        this.knob = new Phaser.GameObjects.Sprite(scene, 0, 80, "sup_panel_knob"); /* 90 */
        this.caption = new Phaser.GameObjects.Text(scene, 0, -60, "Reach a habitable world", text_style);
        this.caption.setOrigin(0.5, 0.5);

        this.add(this.panel);
        this.add(this.activity_overlay);
        this.add(this.activity_indl);
        this.add(this.activity_indr);
        this.add(this.formula_section_glow);
        // this.add(this.chamber_glowl);
        // this.add(this.chamber_glowr);

        // this.add(this.knob);
        this.add(this.caption);

        this.player_indl = new Phaser.GameObjects.Sprite(scene, -385, 3, "pilot_fill").setDisplaySize(40, 40).setAlpha(1.0);
        this.player_indr = new Phaser.GameObjects.Sprite(scene, 385, 3, "copilot_fill").setDisplaySize(40, 40).setAlpha(0.0);
        this.player_indl_outline = new Phaser.GameObjects.Sprite(scene, -385, 3, "pilot_outline").setDisplaySize(40, 40).setAlpha(0.0); // .setTint(PLAYER_COLOR);
        this.player_indr_outline = new Phaser.GameObjects.Sprite(scene, 385, 3, "copilot_outline").setDisplaySize(40, 40).setAlpha(1.0); // .setTint(COPILOT_COLOR);
        this.add(this.player_indl);
        this.add(this.player_indr);
        this.add(this.player_indl_outline);
        this.add(this.player_indr_outline);

        this.submask = create_shape_geometry_mask(scene, x, y + 5, 900, 200, banner_mask_path);
        for(let i=0; content != undefined && i<content.length; i++) {
            (content[i] as Phaser.GameObjects.Container || Phaser.GameObjects.Sprite || Phaser.GameObjects.Rectangle).setMask(this.submask);
        }
        this.knob.setMask(this.submask);

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
    
    reload() {
        this.clear_tint();
        if (this.animation != undefined) { this.animation.stop(); }
        this.animation = undefined;
        this.set_caption("Reach a habitable world");

        this.player_indl.setAlpha(1.0);
        this.player_indl_outline.setAlpha(0.0);
        this.activity_indl.setAlpha(1.0);
        this.player_indr.setAlpha(0.0);
        this.player_indr_outline.setAlpha(1.0);
        this.activity_indr.setAlpha(0.0);

        this.formula_section_glow.setAlpha(0.0);
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
        let w = (this.scene as GameScene).get_width();
        let h = (this.scene as GameScene).get_height();
        this.setX(w/2);
        this.setY(h-100);

        // rebuild mask
        this.submask = create_shape_geometry_mask(this.scene, w/2, h-95, 900, 200, banner_mask_path);
        for(let i=0; this.contents != undefined && i<this.contents.length; i++) {
            (this.contents[i] as Phaser.GameObjects.Container || Phaser.GameObjects.Sprite || Phaser.GameObjects.Rectangle).setMask(this.submask);
        }
        this.knob.setMask(this.submask);
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

    clear_tint() {
        let children = this.getAll();
        for(let i=0; i<children.length; i++) {
            (children[i] as Phaser.GameObjects.Sprite).clearTint();
        }
    }

    get_panel(): Phaser.GameObjects.Sprite {
        return this.panel;
    }

    get_activity_overlay(): Phaser.GameObjects.Sprite {
        return this.activity_overlay;
    }

    get_knob(): Phaser.GameObjects.Sprite {
        return this.knob;
    }

    get_player_indl(): Phaser.GameObjects.Sprite {
        return this.player_indl;
    }

    get_player_indr(): Phaser.GameObjects.Sprite {
        return this.player_indr;
    }

    get_player_indl_outline(): Phaser.GameObjects.Sprite {
        return this.player_indl_outline;
    }

    get_player_indr_outline(): Phaser.GameObjects.Sprite {
        return this.player_indr_outline;
    }

    get_activity_indl(): Phaser.GameObjects.Sprite {
        return this.activity_indl;
    }

    get_activity_indr(): Phaser.GameObjects.Sprite {
        return this.activity_indr;
    }

    get_formula_section_glow(): Phaser.GameObjects.Sprite {
        return this.formula_section_glow;
    }

    get_dummy(): Phaser.GameObjects.Sprite {
        return this.tween_dummy;
    }

    static load_sprites(scene: Phaser.Scene) {
        scene.load.image("sup_panel", "assets/Banner_with_activity_box.png");

        // scene.load.image("sup_panel_highlight", "assets/Banner_highlight.png");
        // scene.load.image("sup_panel_inline", "assets/Banner_inline.png");
        // scene.load.image("sup_panel_glow", "assets/Banner_glow_inner_f.png");
        // scene.load.image("sup_panel_glow_inactive", "assets/Banner_glow_inner_right_inactive.png");
        // scene.load.image("sup_panel_glow_active", "assets/Banner_glow_inner_right_active.png");
        // scene.load.image("sup_panel_activity_scale", "assets/Banner_activity_scale.png");
        // scene.load.image("sup_panel_activity_scale_inactive", "assets/Banner_activity_scale_inactive.png");
        // scene.load.image("sup_panel_activity_bar", "assets/Banner_activity_bar.png");
        // scene.load.image("sup_panel_activity_bar", "assets/Banner_activity_indicator.png");
        // scene.load.image("sup_panel_activity_bar_dashes", "assets/Banner_activity_bar_dashes.png");
        // scene.load.image("sup_panel_bottom_dashes", "assets/Banner_bottom_dashes.png");
        // scene.load.image("left_barrier", "assets/Banner_LeftBarrier.png");

        scene.load.image("sup_panel_activity_overlay", "assets/Banner_activity_overlay_chambers.png");
        scene.load.image("sup_panel_formula_section_glow_base", "assets/Banner_formula_glow_chambers.png");
        scene.load.image("sup_panel_chamber_glow_left", "assets/Banner_Chamber_glow_left.png");
        scene.load.image("triangle_indicator", "assets/Triangle_Indicator.png");

        scene.load.image("sup_panel_knob", "assets/Banner_Knob.png");
        scene.load.image("sup_panel_mask", "assets/Banner_Clip_Mask.png");
        scene.load.image("pilot_fill_base", "assets/Pilot40_fill.png");
        scene.load.image("pilot_outline_base", "assets/Pilot40_outline.png");
    }

    static configure_sprites(scene: Phaser.Scene) {
        if (scene.textures.getTextureKeys().includes("pilot_fill")) { return; }

        // Dye Player icons
        duplicate_texture(scene, "pilot_fill_base", "pilot_fill");
        dye_texture(scene, "pilot_fill", PLAYER_COLOR);
        duplicate_texture(scene, "pilot_fill_base", "copilot_fill");
        dye_texture(scene, "copilot_fill", COPILOT_COLOR);
        duplicate_texture(scene, "pilot_outline_base", "pilot_outline");
        dye_texture(scene, "pilot_outline", PLAYER_COLOR);
        duplicate_texture(scene, "pilot_outline_base", "copilot_outline");
        dye_texture(scene, "copilot_outline", COPILOT_COLOR);

        // Dye activity indicators
        duplicate_texture(scene, "triangle_indicator", "pilot_indicator");
        dye_texture(scene, "pilot_indicator", PLAYER_COLOR);
        duplicate_texture(scene, "triangle_indicator", "copilot_indicator");
        dye_texture(scene, "copilot_indicator", COPILOT_COLOR);

        // Dye formula glow
        duplicate_texture(scene, "sup_panel_formula_section_glow_base", "sup_panel_formula_section_glow");
        dye_texture(scene, "sup_panel_formula_section_glow", 0xFFFFFF); // PLAYER_COLOR);
        // dye_texture(scene, "sup_panel_formula_section_glow", COPILOT_COLOR);
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

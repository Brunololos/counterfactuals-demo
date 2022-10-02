import AlphaMaskImage from "phaser3-rex-plugins/plugins/alphamaskimage";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import Game_Scene from "../scenes/Game";
import Base_Scene from "../util/Base_Scene";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

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
        let panel = new Phaser.GameObjects.Sprite(scene, 0, 5, "sup_panel");
        this.add(panel);
        /* let panelk = new Phaser.GameObjects.Sprite(scene, 0, 0, "sup_panel");//.setDisplaySize(w*0.75-20, 180);
        this.add(panelk);
        let panellk = new Phaser.GameObjects.Sprite(scene, 0, -200, "sup_panel_light");//.setDisplaySize(w*0.75-20, 180);
        this.add(panellk);
        let panelll = new Phaser.GameObjects.Sprite(scene, 0, -400, "sup_panel_trans");//.setDisplaySize(w*0.75-20, 180);
        this.add(panelll);
        let panellll = new Phaser.GameObjects.Sprite(scene, 0, -600, "sup_panel_white");//.setDisplaySize(w*0.75-20, 180);
        this.add(panellll);*/
        /* let panelk = new Phaser.GameObjects.Sprite(scene, 0, 0, "sup_panel1");//.setDisplaySize(w*0.75-20, 180);
        this.add(panelk);
        let panellk = new Phaser.GameObjects.Sprite(scene, 0, -190, "sup_panel2");//.setDisplaySize(w*0.75-20, 180);
        this.add(panellk);
        let panelll = new Phaser.GameObjects.Sprite(scene, 0, -380, "sup_panel3");//.setDisplaySize(w*0.75-20, 180);
        this.add(panelll);
        let panellll = new Phaser.GameObjects.Sprite(scene, 0, -570, "sup_panel4");//.setDisplaySize(w*0.75-20, 180);
        this.add(panellll);
        let panelllll = new Phaser.GameObjects.Sprite(scene, 0, -760, "sup_panel5");//.setDisplaySize(w*0.75-20, 180);
        this.add(panelllll); */
        /* let panel = new Phaser.GameObjects.Sprite(scene, -500, -400, "styles").setDisplaySize(500, 500); 
        this.add(panel);
        let panell = new Phaser.GameObjects.Sprite(scene, 500, -400, "styles_moddd").setDisplaySize(500, 500);
        this.add(panell); */
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
        //(this.getAt(0) as Phaser.GameObjects.Rectangle).setDisplaySize(w, 200);
        this.setX(w/2);
        this.setY(h-100);
    }

    static create(scene: Base_Scene, x: number, y: number, content?: Phaser.GameObjects.GameObject[]): Phaser.GameObjects.GameObject {
        let w = (scene as Game_Scene).get_width();
        let h = (scene as Base_Scene).get_height();
        let scroll_background = scene.add.image(0, 0, "sup_panel");
        let slider_knob = scene.add.image(0, 0, "sup_panel_knob");
        var mask = scene.add.image(x, y, "sup_panel_mask").setVisible(false).createBitmapMask();
        let world = scene.add.image(0, 0, "atom");
        let woo = new AlphaMaskImage(scene, w/2, h-200, "world", scene.textures.get("world").firstFrame, {
            mask: {
                key: "sup_panel_mask",
                frame: scene.textures.get("sup_panel_mask").firstFrame,
                scale: 0.25
            },
        })
        scene.add.existing(world);
        var scrollablePanel = scene.rexUI.add.scrollablePanel({
                x: x,
                y: y,
                width: 900,
                height: 200,
      
                scrollMode: 1,
      
                background: scroll_background,
      
                panel: {
                    child: Supposition_Panel.createPanel(scene, content),
      
                    mask: {
                        mask: false,
                        padding: 1,
                        updateMode: 0,
                    },
                },
      
                slider: {
                    thumb: slider_knob,
                },
          
                //scroller: true,
                /* scroller: {
                    pointerOutRelease: false
                }, */
          
                mouseWheelScroller: {
                    focus: false,
                    speed: 0.1
                },
      
                space: {
                    left: 60,
                    right: 60,
                    top: 35,
                    bottom: 0,
      
                    panel: 10,
                    slider: {
                      left: 83,
                      right: 83,
                      top: 0,
                      bottom: 28,
                    },
                },
            })
            .layout()
        return scrollablePanel;
    }

    static load_sprites(scene: Phaser.Scene) {
        //scene.load.image("sup_panel", "assets/SajShafiqueRoof_Alpha.png");
        scene.load.image("sup_panel", "assets/Banner.png");
        scene.load.image("sup_panel_light", "assets/Banner_Holo_Light.png");
        scene.load.image("sup_panel_trans", "assets/Banner_Holo_Trans.png");
        scene.load.image("sup_panel_white", "assets/Banner_Holo_White.png");
        scene.load.image("sup_panel1", "assets/Banner1.png");
        scene.load.image("sup_panel2", "assets/Banner2.png");
        scene.load.image("sup_panel3", "assets/Banner3.png");
        scene.load.image("sup_panel4", "assets/Banner4.png");
        scene.load.image("sup_panel5", "assets/Banner5.png");
        scene.load.image("sup_panel_knob", "assets/Banner_Knob.png");
        scene.load.image("sup_panel_mask", "assets/Banner_Clip_Mask.png");
        scene.load.image("styles", "assets/UI_Styles.png");
        scene.load.image("styles_mod", "assets/UI_Styles_Mod.png");
        scene.load.image("styles_modd", "assets/UI_Styles_Modd.png");
        scene.load.image("styles_moddd", "assets/UI_Styles_Moddd.png");
        scene.load.image("styles_op", "assets/UI_Styles_Opacity.png");
        scene.load.image("styles_fill", "assets/UI_Styles_Fill.png");
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
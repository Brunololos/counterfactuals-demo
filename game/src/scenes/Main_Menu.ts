import { Formula } from "../game/Cf_Logic";
import Base_Scene from "../util/Base_Scene";

export default class Main_Menu_Scene extends Base_Scene {
    private background: Phaser.GameObjects.Sprite;
    private start;

    constructor() {
        super('Main_Menu_Scene');
    }

    preload() {
        this.load.image("launchsite", "assets/Launchsite.png");
        this.load.image("chunk_down", "assets/Chunk_Down.png");
        this.load.image("chunk_down_hover", "assets/Chunk_Down_Hover.png");
        this.load.image("dot", "assets/Wireframe.png");
    }

    create() {
        let w = this.get_width();
        let h = this.get_height();

        this.background = new Phaser.GameObjects.Sprite(this, w/2, h/2, "launchsite").setDisplaySize(w, h).setAlpha(0.75);
        this.add.existing(this.background);
        
        this.start = this.create_button(this, "Start", w/2+w/16, h/2-h/6.25);

        const resize = () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.on_resize();
        }
        window.addEventListener("resize", resize, false);
    }

    update(time: number, delta: number) {
        
    }

    on_resize(): void {
        let w = this.get_width();
        let h = this.get_height();
        this.background.setPosition(w/2, h/2);
        this.background.setDisplaySize(w, h);

        this.start.setPosition(w/2+w/16, h/2-h/6.25);
    }

    private create_button(scene, label, x, y) {
        var button = scene.rexUI.add.label({
            width: 240,
            height: 120,

            orientation: 0,
            background: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "chunk_down")),

            icon: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "dot")),
            text: scene.add.text(0, 0, label),

            space: {
                icon: 10,
                left: 25,
                right: 0,
                top: 0,
                bottom: 20,
            }
        });

        var buttons = scene.rexUI.add.buttons({
            x: x,
            y: y,
            buttons: [],
        })
        .addButton(button)
        .layout();
    
        //button.getElement('background').setTint(0xcccccc);
        buttons.on('button.over', function(button, index, pointer, event) {
            //button.getElement('background').clearTint();
            button.getElement('background').setTexture("chunk_down_hover");
        })
        buttons.on('button.out', function(button, index, pointer, event) {
            //button.getElement('background').setTint(0xcccccc);
            button.getElement('background').setTexture("chunk_down");
        })
        buttons.on('button.click', function(button, index, pointer, event) {
            scene.scene.start('Level_Select_Scene');
        })

        return button;
    }

}
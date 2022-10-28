import { text_style } from "../util/UI_Utils";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class Text_Box_Controller {
    private text_box;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, text: string, icon_keys: string[]) {
        this.text_box = createTextBox(scene, x, y, {
            wrapWidth: width,
            fixedWidth: width,
            fixedHeight: height,
            icon_keys: icon_keys
        })
        .start(text, 50);
        if(text == "") { this.text_box.setVisible(false); }
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.text_box);
    }

    static load_sprites(scene: Phaser.Scene) {
        if(scene.textures.getTextureKeys().includes("long_chunk")) { return; }

        scene.load.image("long_chunk", "assets/Long_Chunk.png");
        scene.load.image("pilots_icon", "assets/Pilots.png");
    }
}

const GetValue = Phaser.Utils.Objects.GetValue;
var createTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var icon_keys = GetValue(config, 'icon_keys', [""]);
    var tween;
    var textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.add.image(0, 0, "long_chunk"),

            icon: (icon_keys.length > 0) ? ((icon_keys[0] == "") ? scene.add.image(0, 0, "dot").setVisible(false) : scene.add.image(0, 0, icon_keys[0])) : undefined,

            text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),

            action: scene.add.image(0, 0, 'back_icon').setScale(0.3, -0.3).setVisible(false),

            space: {
                left: 20,
                right: 20,
                top: 15,
                bottom: 15,
                icon: 10,
                text: 10,
            }
        })
        .setOrigin(0.5, 0.5)
        .layout();
    
    icon_keys = icon_keys.slice(1, icon_keys.length);
    textBox
        .setInteractive()
        .on('pointerdown', function () {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if(this.isTyping) {
                this.stop(true);
            } else {
                if(!this.isLastPage) {
                    this.typeNextPage();
                    if(icon_keys.length > 0 && icon_keys[0] != "") {
                        this.getElement('icon').setTexture(icon_keys[0]);
                        this.getElement('icon').setVisible(true);
                        icon_keys = icon_keys.slice(1, icon_keys.length);
                    } else if(icon_keys.length > 0 && icon_keys[0] == "") {
                        this.getElement('icon').setTexture('dot');
                        this.getElement('icon').setVisible(false);
                        icon_keys = icon_keys.slice(1, icon_keys.length);
                    }
                    this.layout();
                } else { 
                    this.setVisible(false);
                }
            }
        }, textBox)
        .on('pageend', function () {
            if(this.isLastPage) {
                return;
            }

            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            if(tween != undefined) { tween.stop(); }
            icon.y = y-30;
            //icon.y -= 30;
            tween = scene.tweens.add({ // TODO: Bug when clicking through too fast
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}

var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    let style = text_style;
    style.wordWrap = { width: wrapWidth }
    return scene.add.text(0, 0, '', style)
        .setFixedSize(fixedWidth, fixedHeight);
}
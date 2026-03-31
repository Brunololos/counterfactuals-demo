import { PLAYER_COLOR, COPILOT_COLOR, duplicate_texture, dye_texture, overlay_texture, text_style } from "../util/UI_Utils";

export class Text_Box_Controller {
    private text_box;
    private active = true;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, text: string, icon_keys: string[], metaphor_mode: string) {
        this.text_box = createTextBox(scene, x, y, this, {
            wrapWidth: width,
            fixedWidth: width,
            fixedHeight: height,
            icon_keys: icon_keys,
            metaphor_mode: metaphor_mode
        })
        .start(text, 50);
        if(text == "") { this.text_box.setVisible(false); this.set_active(false); }
        this.text_box.getElement('action').getElement('text').text = (this.text_box.pageIndex+1)+"/"+this.text_box.pageCount;
    }

    resize() {
        let w = (this.text_box.scene as Base_Scene).get_width();
        let h = (this.text_box.scene as Base_Scene).get_height();
        this.text_box.setX(w/2);
        this.text_box.setY(h-250);
    }

    reload(text: string) {
        this.text_box.stop();
        this.text_box.start(text, 50);
        if(text == "") { this.text_box.setVisible(false); this.set_active(false);
        } else { this.text_box.setVisible(true); this.set_active(true); }
        this.text_box.getElement('action').getElement('text').text = (this.text_box.pageIndex+1)+"/"+this.text_box.pageCount;
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.text_box);
    }

    activate() {
        if(!this.active) { return; }
        this.text_box.setVisible(true);
        this.text_box.getElement('icon').setVisible(true);
        this.text_box.resume();
    }

    deactivate() {
        if(!this.active) { return; }
        this.text_box.setVisible(false);
        this.text_box.getElement('icon').setVisible(false);
        this.text_box.pause();
    }

    set_active(active: boolean) {
        this.active = active;
    }

    set_metaphor_mode(metaphor_mode: string) {
        // TODO: how to change/update textbox icons depending on metaphor state, while keeping typing state?
    }

    static load_sprites(scene: Phaser.Scene) {
        if(scene.textures.getTextureKeys().includes("long_chunk")) { return; }

        scene.load.image("long_chunk", "assets/Long_Chunk.png");
        // scene.load.image("pilots_intro_bg", "assets/Oct_Rect_Pane.png");
        scene.load.image("pilots_intro_bg", "assets/Pilots_Intro_Empty.png");
        scene.load.image("pilots_intro_player_base", "assets/Pilots_Intro_You_shadow_bright.png");
        scene.load.image("pilots_intro_copilot_base", "assets/Pilots_Intro_Copilot_shadow.png");
        scene.load.image("slim_empty_icon", "assets/Empty_Slim_Icon.png");
    }

    static configure_sprites(scene: Phaser.Scene) {
        if(scene.textures.getTextureKeys().includes("pilots_icon_metaphor")) { return; }

        // Build pilots intro texture
        duplicate_texture(scene, "pilots_intro_bg", "pilots_icon_metaphor");
        duplicate_texture(scene, "pilots_intro_player_base", "pilots_intro_player");
        duplicate_texture(scene, "pilots_intro_copilot_base", "pilots_intro_copilot");
        dye_texture(scene, "pilots_intro_player", PLAYER_COLOR);
        dye_texture(scene, "pilots_intro_copilot", COPILOT_COLOR);
        overlay_texture(scene, "pilots_icon_metaphor", "pilots_intro_player");
        overlay_texture(scene, "pilots_icon_metaphor", "pilots_intro_copilot");

        duplicate_texture(scene, "pilots_icon_metaphor", "pilots_icon_logic");
    }
}

const GetValue = Phaser.Utils.Objects.GetValue;
var createTextBox = function (scene, x, y, text_box_controller, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var icon_keys = GetValue(config, 'icon_keys', [""]);
    var metaphor_mode = GetValue(config, 'metaphor_mode', [""]);
    var tween;
    var textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.add.image(0, 0, "long_chunk"),

        icon: ((icon_keys.length <= 0 || icon_keys[0] == "") ? scene.add.image(0, 0, 'slim_empty_icon') : scene.add.image(0, 0, icon_keys[0] + "_" + metaphor_mode)),

        text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),

        //action: scene.add.image(0, 0, 'back_icon').setScale(0.3, -0.3).setVisible(false),
        action: scene.rexUI.add.label({
            x: 0,
            y: 0,

            orientation: 1,

            icon: scene.add.image(0, 0, 'back_icon').setScale(0.3, -0.3).setVisible(false),

            text: scene.add.text(0, 0, "1/1", text_style).setScale(0.85).setTint(0xcad9e6),

            space: {
                left: 0,
                right: 0,
                top: 0,
                bottom: -23,
        
                icon: 0,
                text: 0,
            }
        }),

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
            var icon = this.getElement('action').getElement('icon').setVisible(false);
            this.resetChildVisibleState(icon);
            if(this.isTyping) {
                this.stop(true);
            } else {
                if(!this.isLastPage) {
                    this.typeNextPage();
                    this.getElement('action').getElement('text').text = (textBox.pageIndex+1)+"/"+textBox.pageCount;
                    if(icon_keys.length > 0 && icon_keys[0] != "") {
                        this.getElement('icon').setTexture(icon_keys[0] + "_" + metaphor_mode);
                        this.getElement('icon').setVisible(true);
                        icon_keys = icon_keys.slice(1, icon_keys.length);
                    } else if(icon_keys.length > 0 && icon_keys[0] == "") {
                        this.getElement('icon').setTexture('slim_empty_icon');
                        this.getElement('icon').setVisible(false);
                        icon_keys = icon_keys.slice(1, icon_keys.length);
                    }
                    this.layout();
                } else { 
                    this.setVisible(false);
                    text_box_controller.set_active(false);
                }
            }
        }, textBox)
        .on('pageend', function () {
            if(this.isLastPage) {
                return;
            }

            var icon = this.getElement('action').getElement('icon').setVisible(true);
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

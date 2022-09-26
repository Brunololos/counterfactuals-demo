import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import { duplicate_texture, dye_texture } from '../util/UI_Utils';

const GLOW = ["red_glow", "blue_glow", "yellow_glow"];

export class Star {
    private scene;
    private x;
    private y;
    private core: Phaser.GameObjects.Sprite;
    private glow: Phaser.GameObjects.Sprite;
    private noise;
    private inc = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.core = new Phaser.GameObjects.Sprite(scene, x, y, "star").setDisplaySize(7.5, 7.5).setAlpha(0.5);
        this.glow = new Phaser.GameObjects.Sprite(scene, x, y, GLOW[Math.floor(Math.random()*GLOW.length)]).setDisplaySize(8.5, 8.5).setAlpha(0.25);
        this.noise = new Perlin(Math.random());

        let timeline = scene.tweens.createTimeline({
            loop: -1,
            //loopDelay: Math.random()*500
        });
        this.fill_flicker_timeline(timeline);
        timeline.play();
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.glow);
        container.add(this.core);
    }

    fill_flicker_timeline(timeline: Phaser.Tweens.Timeline) {
        let states = Math.ceil(Math.random()*4) + 1;

        let offset = Math.random()*500;
        for(let i=0; i<states; i++) {
            let scale = 0.2 + 0.15*Math.random();
            let duration = 400 + Math.random()*100;
            timeline.add({
                targets: [this.core, this.glow],
                scale: scale,
                duration: duration,
                ease: 'Back.easeInOut',
                yoyo: false,
                repeat: 0,
                offset: offset,
            });
            offset += duration;
        }
        timeline.add({
            targets: [this.core, this.glow],
            scale: 0.25,
            duration: 400 + Math.random()*100,
            ease: 'Back.easeInOut',
            yoyo: false,
            repeat: 0,
            offset: offset,
        });
    }

    static load_sprites(scene: Phaser.Scene) {
        scene.load.image("star", "assets/Star.png");
    }

    static configure_sprites(scene: Phaser.Scene) {
        duplicate_texture(scene, "star", "red_glow");
        dye_texture(scene, "red_glow", 0xFF7777);
        duplicate_texture(scene, "star", "blue_glow");
        dye_texture(scene, "blue_glow", 0x277BC0);
        duplicate_texture(scene, "star", "yellow_glow");
        dye_texture(scene, "yellow_glow", 0xFFF6BF);
    }
}
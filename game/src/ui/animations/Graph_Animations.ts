import { World } from "../../util/Graph";
import { World_Controller } from "../Graph_Graphics";

export const IDLE_WORLD_COLOR = 0x9BBFE0;//0x7893AD;
export const IDLE_WORLD_HIGHLIGHT_COLOR = 0xACD4FA;
export const CURRENT_WORLD_COLOR = 0xE0AB79;
export const CURRENT_WORLD_HIGHLIGHT_COLOR = 0xFBC087;//0xFDD87C;

export const WORLD_ALPHA: number = 0.85;
export const INACTIVE_WORLD_ALPHA: number = 0.45;
export const WORLD_BASE_HIGHLIGHT_ALPHA: number = 0.01;
export const WORLD_HIGHLIGHT_ALPHA: number = 0.3;

export const EDGE_ALPHA: number = 0.85;
export const INACTIVE_EDGE_ALPHA: number = 0.4;
export const ATOM_ALPHA: number = 1;
export const INACTIVE_ATOM_ALPHA: number = 0.7;//0.45;

export enum World_Animation {
    NONE,
    BLINK
}

export class World_Animations {
    static fill_world_animation_timeline(timeline: Phaser.Tweens.Timeline, worlds: World_Controller[], type: World_Animation) {
        switch(type) {
            case World_Animation.BLINK:
                timeline.add({
                    targets: worlds.map((value) => value.get_hover_ellipse()),
                    alpha: WORLD_HIGHLIGHT_ALPHA,//0.5,
                    duration: 1000,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
        
                });
                timeline.add({
                    targets: worlds.map((value) => value.get_hover_ellipse()),
                    alpha: WORLD_BASE_HIGHLIGHT_ALPHA,
                    duration: 1000,
                    ease: 'Cubic.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1000,
        
                });
                break;
        }
    }

    static create(scene: Phaser.Scene, worlds: World_Controller[], type: World_Animation): Phaser.Tweens.Timeline {
        let timeline = scene.tweens.createTimeline({
            loop: -1
        });
        World_Animations.fill_world_animation_timeline(timeline, worlds, type);
        return timeline;
    };
}
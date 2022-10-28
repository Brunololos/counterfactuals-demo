import { Player } from "../../util/Game_Utils";
import { Game_Graphics_Mode, interpolate_colors } from "../../util/UI_Utils";
import { Supposition_Panel } from "../Supposition_Panel";

export enum Supposition_Panel_Animation {
    NONE,
    Attacker_Victory,
    Defender_Victory,
    Attacker_Shift_Switch,
    Defender_Shift_Switch,
    Attacker_Left_AND,
    Attacker_Right_AND,
    Defender_Left_AND,
    Defender_Right_AND,
    Attacker_Necessity,
    Defender_Necessity,
}

export class Supposition_Panel_Animations {
    static fill_animation_timeline(timeline: Phaser.Tweens.Timeline, sup_panel: Supposition_Panel, type: Supposition_Panel_Animation) {
        switch(type) {
            case Supposition_Panel_Animation.Attacker_Victory:
                /* timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 950,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onComplete: function() {
                        sup_panel.get_knob().setTint(0xdd0000);
                        sup_panel.get_panel().setTint(0xdd0000);
                        sup_panel.get_player_ind1().setTint(0xdd0000);
                        sup_panel.get_player_ind2().setTint(0xdd0000);
                    }
                }); */
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = timeline.elapsed/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color1 = interpolate_colors(prev_color, 0xdd0000, frac);
                        let color2 = interpolate_colors(prev_color, 0xdd0000, frac);
                        sup_panel.get_knob().setTint(color1);
                        sup_panel.get_panel().setTint(color1);
                        sup_panel.get_player_ind1().setTint(color2);
                        sup_panel.get_player_ind2().setTint(color2);
                    }
                });
                return;
            case Supposition_Panel_Animation.Defender_Victory:
                /* timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 950,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onComplete: function() {
                        sup_panel.get_knob().setTint(0x00dd00);
                        sup_panel.get_panel().setTint(0x00dd00);
                        sup_panel.get_player_ind1().setTint(0x00dd00);
                        sup_panel.get_player_ind2().setTint(0x00dd00);
                    }
                }); */
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = timeline.elapsed/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color1 = interpolate_colors(prev_color, 0x00dd00, frac);
                        let color2 = interpolate_colors(prev_color, 0x00dd00, frac);
                        sup_panel.get_knob().setTint(color1);
                        sup_panel.get_panel().setTint(color1);
                        sup_panel.get_player_ind1().setTint(color2);
                        sup_panel.get_player_ind2().setTint(color2);
                    }
                });
                return;
            case Supposition_Panel_Animation.Attacker_Shift_Switch:
                /* timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 950,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onComplete: function() {
                        sup_panel.get_knob().setTint(0xffffff);
                        sup_panel.get_panel().setTint(0xffffff);
                        sup_panel.get_player_ind1().setTint(0x00dd00);
                        sup_panel.get_player_ind2().setTint(0x00dd00);
                    }
                }); */
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = timeline.elapsed/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color1 = interpolate_colors(prev_color, 0xffffff, frac);
                        let color2 = interpolate_colors(prev_color, 0x00dd00, frac);
                        sup_panel.get_knob().setTint(color1);
                        sup_panel.get_panel().setTint(color1);
                        sup_panel.get_player_ind1().setTint(color2);
                        sup_panel.get_player_ind2().setTint(color2);
                    }
                });
                return;
            case Supposition_Panel_Animation.Defender_Shift_Switch:
                /* timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 950,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onComplete: function() {
                        sup_panel.get_knob().setTint(0xdd0000);
                        sup_panel.get_panel().setTint(0xdd0000);
                        sup_panel.get_player_ind1().setTint(0xdd0000);
                        sup_panel.get_player_ind2().setTint(0xdd0000);
                    }
                }); */
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = timeline.elapsed/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color1 = interpolate_colors(prev_color, 0xdd0000, frac);
                        let color2 = interpolate_colors(prev_color, 0xdd0000, frac);
                        sup_panel.get_knob().setTint(color1);
                        sup_panel.get_panel().setTint(color1);
                        sup_panel.get_player_ind1().setTint(color2);
                        sup_panel.get_player_ind2().setTint(color2);
                    }
                });
                return;
            /* case Supposition_Panel_Animation.Attacker_Left_AND:
            case Supposition_Panel_Animation.Attacker_Right_AND:
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1000,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 150,
                    onStart: function() {
                        sup_panel.get_knob().setTint(0xffffff);
                        sup_panel.get_panel().setTint(0xffffff);
                    }
                });
                break; */
            case Supposition_Panel_Animation.Defender_Left_AND:
            case Supposition_Panel_Animation.Defender_Right_AND:
                /* timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 4300, // 4350?
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 150,
                    onStart: function() {
                        sup_panel.get_knob().setTint(0xdd0000);
                        sup_panel.get_panel().setTint(0xdd0000);
                        sup_panel.get_player_ind1().setTint(0xdd0000);
                        sup_panel.get_player_ind2().setTint(0xdd0000);
                    },
                    onComplete: function() {
                        sup_panel.get_knob().setTint(0xffffff);
                        sup_panel.get_panel().setTint(0xffffff);
                        sup_panel.get_player_ind1().setTint(0x00dd00);
                        sup_panel.get_player_ind2().setTint(0x00dd00);
                    }
                }); */
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = timeline.elapsed/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color = interpolate_colors(prev_color, 0xdd0000, frac);
                        sup_panel.get_knob().setTint(color);
                        sup_panel.get_panel().setTint(color);
                    }
                });
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 3000,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 4500) { return; }
                        let frac = (timeline.elapsed-3000)/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color = interpolate_colors(prev_color, 0xffffff, frac);
                        sup_panel.get_knob().setTint(color);
                        sup_panel.get_panel().setTint(color);
                    }
                });
                return;
            case Supposition_Panel_Animation.Attacker_Necessity:
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 750,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 750) { return; }
                        let frac = timeline.elapsed/750;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color = interpolate_colors(prev_color, 0xffffff, frac);
                        sup_panel.get_knob().setTint(color);
                        sup_panel.get_panel().setTint(color);
                    }
                });
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 750,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 750,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = (timeline.elapsed-750)/750;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color = interpolate_colors(prev_color, 0xdd0000, frac);
                        sup_panel.get_knob().setTint(color);
                        sup_panel.get_panel().setTint(color);
                    }
                });
                return;
            case Supposition_Panel_Animation.Defender_Necessity:
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = timeline.elapsed/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color = interpolate_colors(prev_color, 0xdd0000, frac);
                        sup_panel.get_knob().setTint(color);
                        sup_panel.get_panel().setTint(color);
                    }
                });
                return;
        }
    }

    static fill_transition_animation_timeline(timeline: Phaser.Tweens.Timeline, sup_panel: Supposition_Panel, player: Player) {
        switch(player) {
            case Player.Attacker:
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = timeline.elapsed/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color = interpolate_colors(prev_color, 0xdd0000, frac);
                        sup_panel.get_knob().setTint(color);
                        sup_panel.get_panel().setTint(color);
                    }
                });
                return;
            case Player.Defender:
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        if(timeline.totalElapsed > 1500) { return; }
                        let frac = timeline.elapsed/1500;
                        let prev_color = sup_panel.get_panel().tintTopLeft;
                        let color = interpolate_colors(prev_color, 0xffffff, frac);
                        sup_panel.get_knob().setTint(color);
                        sup_panel.get_panel().setTint(color);
                    }
                });
                return;
        }
    }

    static create(scene: Phaser.Scene, sup_panel: Supposition_Panel, type: Supposition_Panel_Animation): Phaser.Tweens.Timeline {
        let timeline = scene.tweens.createTimeline({
            loop: -1
        });
        Supposition_Panel_Animations.fill_animation_timeline(timeline, sup_panel, type);
        return timeline;
    };

    static create_transition(scene: Phaser.Scene, sup_panel: Supposition_Panel, player: Player): Phaser.Tweens.Timeline {
        let timeline = scene.tweens.createTimeline({
            loop: 0
        });
        Supposition_Panel_Animations.fill_transition_animation_timeline(timeline, sup_panel, player);
        return timeline;
    };
}
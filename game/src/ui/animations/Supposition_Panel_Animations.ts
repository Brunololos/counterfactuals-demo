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
    Defender_Right_AND
}

export class Supposition_Panel_Animations {
    static fill_animation_timeline(timeline: Phaser.Tweens.Timeline, sup_panel: Supposition_Panel, type: Supposition_Panel_Animation) {
        switch(type) {
            case Supposition_Panel_Animation.Attacker_Victory:
                timeline.add({
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
                });
                break;
            case Supposition_Panel_Animation.Defender_Victory:
                timeline.add({
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
                });
                break;
            case Supposition_Panel_Animation.Attacker_Shift_Switch:
                timeline.add({
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
                });
                break;
            case Supposition_Panel_Animation.Defender_Shift_Switch:
                timeline.add({
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
                });
                break;
            case Supposition_Panel_Animation.Attacker_Left_AND:
            case Supposition_Panel_Animation.Attacker_Right_AND: // TODO: Still looks a bit choppy
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
                break;
            case Supposition_Panel_Animation.Defender_Left_AND: // TODO: Still looks a bit choppy
            case Supposition_Panel_Animation.Defender_Right_AND:
                timeline.add({
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
                });
                break;
        }
    }

    static create(scene: Phaser.Scene, sup_panel: Supposition_Panel, type: Supposition_Panel_Animation): Phaser.Tweens.Timeline {
        let timeline = scene.tweens.createTimeline({
            loop: -1
        });
        Supposition_Panel_Animations.fill_animation_timeline(timeline, sup_panel, type);
        return timeline;
    };
}
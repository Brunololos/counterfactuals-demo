import { Player } from "../../util/Game_Utils";
import { Game_Graphics_Mode, PLAYER_COLOR, COPILOT_COLOR, VICTORY_COLOR, LOSS_COLOR, interpolate_colors } from "../../util/UI_Utils";
import { Supposition_Panel } from "../Supposition_Panel";

export enum Supposition_Panel_Animation {
    NONE,

    // MOVES
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
    Attacker_Might_Target_Evaluation,
    Attacker_Might_Closer_Phi_World,
    Attacker_Would_Sphere_Selection,
    Defender_Would_Sphere_Selection,
    Attacker_Vacuous_Would_Sphere_Selection,
    Defender_Vacuous_Would_Sphere_Selection,

    // INPUT HIGHLIGHTING
    Enter_Player_Input,
    Exit_Player_Input,
}

export class Supposition_Panel_Animations {
    static fill_animation_timeline(timeline: Phaser.Tweens.Timeline, sup_panel: Supposition_Panel, type: Supposition_Panel_Animation) {
        switch(type) {
            case Supposition_Panel_Animation.Attacker_Victory:
                if (sup_panel.get_activity_indl().alpha != 0) {
                    sup_panel.get_activity_indl().setTexture("triangle_indicator");
                    sup_panel.get_player_indl().setTexture("pilot_fill_base");
                    sup_panel.get_player_indr_outline().setTexture("pilot_outline_base");
                } else {
                    sup_panel.get_activity_indr().setTexture("triangle_indicator");
                    sup_panel.get_player_indr().setTexture("pilot_fill_base");
                    sup_panel.get_player_indl_outline().setTexture("pilot_outline_base");
                }
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
                        let color1 = interpolate_colors(prev_color, LOSS_COLOR, frac);
                        let color2 = interpolate_colors(prev_color, LOSS_COLOR, frac);
                        sup_panel.get_knob().setTint(color1);
                        sup_panel.get_panel().setTint(color1);
                        sup_panel.get_activity_overlay().setTint(color2);
                        if (sup_panel.get_activity_indl().alpha != 0) {
                            sup_panel.get_activity_indl().setTint(color2);
                            sup_panel.get_player_indl().setTint(color2);
                            // sup_panel.get_chamber_glowl().setTint(color2);
                            sup_panel.get_player_indr_outline().setTint(color2);
                        } else {
                            sup_panel.get_activity_indr().setTint(color2);
                            sup_panel.get_player_indr().setTint(color2);
                            // sup_panel.get_chamber_glowr().setTint(color2);
                            sup_panel.get_player_indl_outline().setTint(color2);
                        }
                        // sup_panel.get_chamber_glowl().alpha = 0.75*(1.0-frac);
                        // sup_panel.get_chamber_glowr().alpha = 0.75*(1.0-frac);
                    }
                });
                timeline.add({
                    targets: [sup_panel.get_chamber_glowl(),
                              sup_panel.get_chamber_glowr()],
                    alpha: 0,
                    duration: 750,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                });
                return;
            case Supposition_Panel_Animation.Defender_Victory:
                if (sup_panel.get_activity_indl().alpha != 0) {
                    sup_panel.get_activity_indl().setTexture("triangle_indicator");
                    sup_panel.get_player_indl().setTexture("pilot_fill_base");
                    sup_panel.get_player_indr_outline().setTexture("pilot_outline_base");
                } else {
                    sup_panel.get_activity_indr().setTexture("triangle_indicator");
                    sup_panel.get_player_indr().setTexture("pilot_fill_base");
                    sup_panel.get_player_indl_outline().setTexture("pilot_outline_base");
                }
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
                        let color1 = interpolate_colors(prev_color, VICTORY_COLOR, frac);
                        let color2 = interpolate_colors(prev_color, VICTORY_COLOR, frac);
                        sup_panel.get_knob().setTint(color1);
                        sup_panel.get_panel().setTint(color1);
                        sup_panel.get_activity_overlay().setTint(color2);
                        if (sup_panel.get_activity_indl().alpha != 0) {
                            sup_panel.get_activity_indl().setTint(color2);
                            sup_panel.get_player_indl().setTint(color2);
                            sup_panel.get_chamber_glowl().setTint(color2);
                            sup_panel.get_player_indr_outline().setTint(color2);
                        } else {
                            sup_panel.get_activity_indr().setTint(color2);
                            sup_panel.get_player_indr().setTint(color2);
                            sup_panel.get_chamber_glowr().setTint(color2);
                            sup_panel.get_player_indl_outline().setTint(color2);
                        }
                    }
                });
                timeline.add({
                    targets: [sup_panel.get_chamber_glowl(),
                              sup_panel.get_chamber_glowr()],
                    alpha: 0,
                    duration: 750,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                });
                return;
            case Supposition_Panel_Animation.Attacker_Shift_Switch:
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        let frac = timeline.elapsed/1500;
                        if(timeline.totalElapsed > 1500) { frac = 1.0; }

                        sup_panel.get_activity_indl().setAlpha(frac),
                        sup_panel.get_player_indl().setAlpha(frac),
                        sup_panel.get_chamber_glowl().setAlpha(frac)
                        sup_panel.get_player_indr_outline().setAlpha(frac)

                        sup_panel.get_activity_indr().setAlpha(1-frac),
                        sup_panel.get_player_indr().setAlpha(1-frac),
                        sup_panel.get_chamber_glowr().setAlpha(1-frac)
                        sup_panel.get_player_indl_outline().setAlpha(1-frac)
                    }
                });
                return;
            case Supposition_Panel_Animation.Defender_Shift_Switch:
                timeline.add({
                    targets: sup_panel.get_dummy(),
                    x: 0,
                    duration: 1500,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                    onUpdate: function(tween: Phaser.Tweens.Tween) {
                        let frac = timeline.elapsed/1500;
                        if(timeline.totalElapsed > 1500) { frac = 1.0; }

                        sup_panel.get_activity_indr().setAlpha(frac),
                        sup_panel.get_player_indr().setAlpha(frac),
                        sup_panel.get_chamber_glowr().setAlpha(frac)
                        sup_panel.get_player_indl_outline().setAlpha(frac)

                        sup_panel.get_activity_indl().setAlpha(1-frac),
                        sup_panel.get_player_indl().setAlpha(1-frac),
                        sup_panel.get_chamber_glowl().setAlpha(1-frac)
                        sup_panel.get_player_indr_outline().setAlpha(1-frac)
                    }
                });
                return;
            case Supposition_Panel_Animation.Defender_Left_AND:
            case Supposition_Panel_Animation.Defender_Right_AND:
                sup_panel.get_formula_section_glow().setTint(COPILOT_COLOR);
                timeline.add({
                    targets: sup_panel.get_formula_section_glow(),
                    alpha: 0.75,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                });
                timeline.add({
                    targets: sup_panel.get_formula_section_glow(),
                    alpha: 0.0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 3000,
                });
                return;
            case Supposition_Panel_Animation.Attacker_Necessity:
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 750,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 0,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 750) { return; }
            //             let frac = timeline.elapsed/750;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, 0xffffff, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 750,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 750,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 1500) { return; }
            //             let frac = (timeline.elapsed-750)/750;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, LOSS_COLOR, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
                return;
            case Supposition_Panel_Animation.Defender_Necessity:
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 1500,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 0,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 1500) { return; }
            //             let frac = timeline.elapsed/1500;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, LOSS_COLOR, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
                return;
            case Supposition_Panel_Animation.Attacker_Might_Target_Evaluation: // TODO: So fast it looks flickery
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 750,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 0,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 750) { return; }
            //             let frac = timeline.elapsed/750;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, LOSS_COLOR, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 750,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 750,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 1500) { return; }
            //             let frac = (timeline.elapsed-750)/750;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, 0xffffff, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
                return;
            case Supposition_Panel_Animation.Attacker_Might_Closer_Phi_World:
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 1500,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 0,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 1500) { return; }
            //             let frac = timeline.elapsed/1500;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, LOSS_COLOR, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 1500,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 1500,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 3000) { return; }
            //             let frac = (timeline.elapsed-1500)/1500;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, 0xffffff, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
                return;
            case Supposition_Panel_Animation.Attacker_Would_Sphere_Selection:
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 750,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 0,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 750) { return; }
            //             let frac = timeline.elapsed/750;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, LOSS_COLOR, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 750,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 750,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 1500) { return; }
            //             let frac = (timeline.elapsed-750)/750;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, 0xffffff, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
                return;
            case Supposition_Panel_Animation.Defender_Would_Sphere_Selection:
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 750,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 0,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 750) { return; }
            //             let frac = timeline.elapsed/750;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, 0xffffff, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 750,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 750,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 1500) { return; }
            //             let frac = (timeline.elapsed-750)/750;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, LOSS_COLOR, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
                return;
            case Supposition_Panel_Animation.Attacker_Vacuous_Would_Sphere_Selection:
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 1500,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 0,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 1500) { return; }
            //             let frac = timeline.elapsed/1500;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, LOSS_COLOR, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
                return;
            case Supposition_Panel_Animation.Defender_Vacuous_Would_Sphere_Selection:
            //     timeline.add({
            //         targets: sup_panel.get_dummy(),
            //         x: 0,
            //         duration: 1500,
            //         ease: 'Cubic.In',
            //         yoyo: false,
            //         repeat: 0,
            //         offset: 0,
            //         onUpdate: function(tween: Phaser.Tweens.Tween) {
            //             if(timeline.totalElapsed > 1500) { return; }
            //             let frac = timeline.elapsed/1500;
            //             let prev_color = sup_panel.get_panel().tintTopLeft;
            //             let color = interpolate_colors(prev_color, 0xffffff, frac);
            //             sup_panel.get_knob().setTint(color);
            //             sup_panel.get_panel().setTint(color);
            //         }
            //     });
                return;
            case Supposition_Panel_Animation.Enter_Player_Input:
                sup_panel.get_formula_section_glow().setTint(PLAYER_COLOR);
                timeline.loop = -1;
                timeline.add({
                    targets: sup_panel.get_formula_section_glow(),
                    alpha: 0.75,
                    duration: 1000,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                });
                timeline.add({
                    targets: sup_panel.get_formula_section_glow(),
                    alpha: 0.0,
                    duration: 1000,
                    ease: 'Cubic.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1000,
                });
                return;
            case Supposition_Panel_Animation.Exit_Player_Input:
                timeline.add({
                    targets: sup_panel.get_formula_section_glow(),
                    alpha: 0.0,
                    duration: 1500,
                    ease: 'Cubic.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                });
                return;
        }
    }

    static fill_transition_animation_timeline(timeline: Phaser.Tweens.Timeline, sup_panel: Supposition_Panel, player: Player) {
        switch(player) {
            case Player.Attacker:
                // timeline.add({
                //     targets: sup_panel.get_dummy(),
                //     x: 0,
                //     duration: 1500,
                //     ease: 'Cubic.In',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                //     onUpdate: function(tween: Phaser.Tweens.Tween) {
                //         if(timeline.totalElapsed > 1500) { return; }
                //         let frac = timeline.elapsed/1500;
                //         let prev_color = sup_panel.get_panel().tintTopLeft;
                //         let color = interpolate_colors(prev_color, LOSS_COLOR, frac);
                //         sup_panel.get_knob().setTint(color);
                //         sup_panel.get_panel().setTint(color);
                //     }
                // });

                // timeline.add({
                //     targets: sup_panel.get_dummy(),
                //     x: 0,
                //     duration: 1500,
                //     ease: 'Cubic.In',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                //     onUpdate: function(tween: Phaser.Tweens.Tween) {
                //         if(timeline.totalElapsed > 1500) { return; }
                //         let frac = timeline.elapsed/1500;
                //         let prev_color = sup_panel.get_formula_section_glow().tintTopLeft;
                //         let color = interpolate_colors(prev_color, COPILOT_COLOR, frac);
                //         sup_panel.get_formula_section_glow().setAlpha(frac*0.75);
                //         sup_panel.get_formula_section_glow().setTint(color);
                //     }
                // });

                // console.log("Attacker transition");
                // timeline.add({
                //     targets: [sup_panel.get_activity_indl(),
                //               sup_panel.get_player_indl(),
                //               sup_panel.get_player_indr_outline()],
                //     alpha: 0,
                //     duration: 1500,
                //     ease: 'Quart.Out',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                // });
                // timeline.add({
                //     targets: [sup_panel.get_activity_indr(),
                //               sup_panel.get_player_indl_outline(),
                //               sup_panel.get_player_indr()],
                //     alpha: 1,
                //     duration: 1500,
                //     ease: 'Quart.Out',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                // });
                return;
            case Player.Defender:
                // timeline.add({
                //     targets: sup_panel.get_dummy(),
                //     x: 0,
                //     duration: 1500,
                //     ease: 'Cubic.In',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                //     onUpdate: function(tween: Phaser.Tweens.Tween) {
                //         if(timeline.totalElapsed > 1500) { return; }
                //         let frac = timeline.elapsed/1500;
                //         let prev_color = sup_panel.get_panel().tintTopLeft;
                //         let color = interpolate_colors(prev_color, 0xffffff, frac);
                //         sup_panel.get_knob().setTint(color);
                //         sup_panel.get_panel().setTint(color);
                //     }
                // });

                // timeline.add({
                //     targets: sup_panel.get_dummy(),
                //     x: 0,
                //     duration: 1500,
                //     ease: 'Cubic.In',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                //     onUpdate: function(tween: Phaser.Tweens.Tween) {
                //         if(timeline.totalElapsed > 1500) { return; }
                //         let frac = timeline.elapsed/1500;
                //         let prev_color = sup_panel.get_formula_section_glow().tintTopLeft;
                //         let color = interpolate_colors(prev_color, PLAYER_COLOR, frac);
                //         sup_panel.get_formula_section_glow().setAlpha(frac*0.75);
                //         sup_panel.get_formula_section_glow().setTint(color);
                //     }
                // });

                // timeline.add({
                //     targets: sup_panel.get_dummy(),
                //     x: 0,
                //     duration: 1500,
                //     ease: 'Cubic.In',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                //     onUpdate: function(tween: Phaser.Tweens.Tween) {
                //         if(timeline.totalElapsed > 1500) { return; }
                //         let frac = timeline.elapsed/1500;
                //         sup_panel.get_activity_indr().setAlpha(frac);
                //         sup_panel.get_player_indr_outline().setAlpha(frac);
                //         sup_panel.get_activity_indl().setAlpha(frac);

                //         sup_panel.get_activity_indl().setAlpha(1-frac);
                //         sup_panel.get_player_indl_outline().setAlpha(1-frac);
                //         sup_panel.get_activity_indr().setAlpha(1-frac);

                //     }
                // });

                // timeline.add({
                //     targets: [sup_panel.get_activity_indr(),
                //               sup_panel.get_player_indl_outline(),
                //               sup_panel.get_player_indr()],
                //     alpha: 0,
                //     duration: 1500,
                //     ease: 'Quart.Out',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                // });
                // timeline.add({
                //     targets: [sup_panel.get_activity_indl(),
                //               sup_panel.get_player_indl(),
                //               sup_panel.get_player_indr_outline()],
                //     alpha: 1,
                //     duration: 1500,
                //     ease: 'Quart.Out',
                //     yoyo: false,
                //     repeat: 0,
                //     offset: 0,
                // });
                return;
        }
    }

    static create(scene: Phaser.Scene, sup_panel: Supposition_Panel, type: Supposition_Panel_Animation): Phaser.Tweens.Timeline {
        let timeline = scene.tweens.createTimeline({
            loop: 0 // -1
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

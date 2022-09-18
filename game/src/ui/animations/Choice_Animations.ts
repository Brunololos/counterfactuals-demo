import { Game_Graphics_Mode } from "../../util/UI_Utils";
import { Choice, OPTION_BOX_OUT } from "../Choice";

export class Choice_Animations {
    static fill_transition_animation_timeline(timeline: Phaser.Tweens.Timeline, transition: [Game_Graphics_Mode, Game_Graphics_Mode], c: Choice): number {
        switch(true) {
            case transition[0] == Game_Graphics_Mode.Formula_Choice && transition[1] == Game_Graphics_Mode.Formula:
                timeline.add({ /* FADE OPTION_BOXES, NOT CHOSEN FORMULA & OR */
                    targets: [c.get_or(), c.get_not_chosen_graphics(), c.get_option_boxes()[0], c.get_option_boxes()[1]],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHOSEN FORMULA */
                    targets: c.get_chosen_graphic(),
                    x: c.get_x(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            /* DEFENDER_VACUOUS_TRUTH_CLAIM */
            case transition[0] == Game_Graphics_Mode.Counterfactual_Choice && transition[1] == Game_Graphics_Mode.Formula:
                timeline.add({ /* FADE OPTION_BOXES, NOT CHOSEN OPTION & OR */
                    targets: [c.get_or(), c.get_not_chosen_graphics(), c.get_option_boxes()[0], c.get_option_boxes()[1]],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHOSEN FORMULA */
                    targets: c.get_chosen_graphic(),
                    x: c.get_x(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            /* DEFENDER_PHI_EVALUATION */
            case transition[0] == Game_Graphics_Mode.Negated_Counterfactual_Choice && transition[1] == Game_Graphics_Mode.Formula:
                timeline.add({ /* FADE OPTION_BOXES, NOT CHOSEN OPTION & OR */
                    targets: [c.get_or(), c.get_not_chosen_graphics(), c.get_option_boxes()[0], c.get_option_boxes()[1]],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHOSEN FORMULA */
                    targets: c.get_chosen_graphic(),
                    x: c.get_x(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            /* DEFENDER_SPHERE_SELECTION */
            case transition[0] == Game_Graphics_Mode.Counterfactual_Choice && transition[1] == Game_Graphics_Mode.World_Choice:
                timeline.add({ /* FADE OPTION_BOXES, NOT CHOSEN OPTION & OR */
                    targets: [c.get_or(), c.get_not_chosen_graphics(), c.get_option_boxes()[0], c.get_option_boxes()[1]],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHOSEN FORMULA */
                    targets: c.get_chosen_graphic(),
                    x: c.get_x(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            /* DEFENDER_WORLD_CHOICE */
            case transition[0] == Game_Graphics_Mode.Negated_Counterfactual_Choice && transition[1] == Game_Graphics_Mode.World_Choice:
                timeline.add({ /* FADE OPTION_BOXES, NOT CHOSEN OPTION & OR */
                    targets: [c.get_or(), c.get_not_chosen_graphics(), c.get_option_boxes()[0], c.get_option_boxes()[1]],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHOSEN FORMULA */
                    targets: c.get_chosen_graphic(),
                    x: c.get_x(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case transition[0] == Game_Graphics_Mode.World_Choice && transition[1] == Game_Graphics_Mode.Formula:
                return 1500;
            default:
                return 1500;
        }
    }

    static fill_popup_animation_timeline(timeline: Phaser.Tweens.Timeline, c: Choice): number {
        timeline.add({ /* FADE IN OPTION_BOXES */
            targets: c.get_option_boxes(),
            alpha: OPTION_BOX_OUT,
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        timeline.add({ /* FADE IN OR */
            targets: c.get_or(),
            alpha: 1,
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        timeline.add({ /* SCALE IN RIGHT OPTION_BOX */
            targets: c.get_option_boxes()[0],
            displayWidth: c.get_option_graphic(0).get_width(),
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        timeline.add({ /* SCALE IN LEFT OPTION_BOX */
            targets: c.get_option_boxes()[1],
            displayWidth: c.get_option_graphic(1).get_width(),
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        timeline.add({ /* SCALE IN OR */
            targets: c.get_or(),
            scale: 1,
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        return 1500;
    }

    static fill_cf_popup_animation_timeline(timeline: Phaser.Tweens.Timeline, c: Choice): number {
        timeline.add({ /* FADE IN OPTION_BOXES */
            targets: c.get_option_boxes(),
            alpha: OPTION_BOX_OUT,
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        timeline.add({ /* FADE IN ANTECEDENT & OR */
            targets: [c.get_option_graphic(0), c.get_or()],
            alpha: 1,
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        timeline.add({ /* SCALE IN RIGHT OPTION_BOX */
            targets: c.get_option_boxes()[0],
            displayWidth: c.get_option_graphic(0).get_width(),
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        timeline.add({ /* SCALE IN LEFT OPTION_BOX */
            targets: c.get_option_boxes()[1],
            displayWidth: c.get_option_graphic(1).get_width(),
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        timeline.add({ /* SCALE IN OR */
            targets: c.get_or(),
            scale: 1,
            duration: 1500,
            ease: 'Quart.Out',
            yoyo: false,
            repeat: 0,
            offset: 0
        });
        return 1500;
    }
}
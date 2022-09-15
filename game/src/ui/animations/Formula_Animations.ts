import { Rules } from "../../game/Game_Rules";
import { Game_Graphics_Mode } from "../../util/UI_Utils";
import { BRACKET_WIDTH, Formula_Graphics_Element, ICON_WIDTH } from "../Formula_Graphics";

export class Formula_Animations {
    static fill_animation_timeline(timeline: Phaser.Tweens.Timeline, move: Rules, f: Formula_Graphics_Element): number {
        let atom, neg, disj, left_child, right_child, left, right;
        switch(move) {
            case Rules.Attacker_Victory:
                return 1500;
            case Rules.Defender_Victory:
                return 1500;
            case Rules.Known_Fact:
                timeline.add({ /* FADE ATOM */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Unknown_Fact:
                timeline.add({ /* FADE ATOM */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Negated_Known_Fact:
                atom = f.get_child("l");
                timeline.add({ /* FADE NEGATION & ATOM */
                    targets: [f, atom],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Negated_Unknown_Fact:
                atom = f.get_child("l");
                timeline.add({ /* FADE NEGATION & ATOM */
                    targets: [f, atom],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Double_Negation:
                neg = f.get_child("l");
                timeline.add({ /* MOVE PARENT NEGATION */
                    targets: f,
                    x: f.x + ICON_WIDTH/2,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHILD NEGATION */
                    targets: neg,
                    x: neg.x - ICON_WIDTH/2,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE BOTH NEGATIONS */
                    targets: [f, neg],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHILD NEGATION CHILDREN */
                    targets: neg.get_children(),
                    x: '-='+ICON_WIDTH.toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* MOVE CHILD NEGATION CHILDREN EMBEDDINGS */
                    targets: neg.get_child("l").get_embedding(true),
                    x: '-='+ICON_WIDTH.toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                return 3000;
            case Rules.Left_OR:
                return 1500;
            case Rules.Right_OR:
                return 1500;
            case Rules.Negated_Left_OR:
                disj = f.get_child("l");
                left_child = f.get_child("ll");
                right_child = f.get_child("lr");
                timeline.add({ /* FADE DISJUNCTION & RIGHT CHILD TREE */
                    targets: right_child.get_children([disj, right_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE DISJUNCTION & RIGHT_CHILD EMBEDDINGS */
                    targets: disj.get_embedding().concat(right_child.get_embedding(true)),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE NEGATION */
                    targets: f,
                    x: '+='+((disj.get_width() - left_child.get_width())/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* MOVE LEFT CHILD */
                    targets: left_child.get_children([left_child]),
                    x: '+='+((disj.get_width() - left_child.get_width())/2 - BRACKET_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* MOVE LEFT CHILD EMBEDDINGS */
                    targets: left_child.get_embedding(true),
                    x: '+='+((disj.get_width() - left_child.get_width())/2 - BRACKET_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                return 3000;
            case Rules.Negated_Right_OR:
                disj = f.get_child("l");
                left_child = f.get_child("ll");
                right_child = f.get_child("lr");
                timeline.add({ /* FADE DISJUNCTION & LEFT CHILD TREE */
                    targets: left_child.get_children([disj, left_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE DISJUNCTION EMBEDDING & LEFT_CHILD EMBEDDINGS */
                    targets: disj.get_embedding().concat(left_child.get_embedding(true)),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE NEGATION */
                    targets: f,
                    x: '+='+((f.get_width() - ICON_WIDTH)/2 - right_child.get_width()/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* MOVE RIGHT CHILD */
                    targets: right_child.get_children([right_child]),
                    x: '+='+((-f.get_width() + right_child.get_width())/2 + BRACKET_WIDTH + ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* MOVE RIGHT CHILD EMBEDDINGS */
                    targets: right_child.get_embedding(true),
                    x: '+='+((-f.get_width() + right_child.get_width())/2 + BRACKET_WIDTH + ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                return 3000;
            default:
                return 1500;
        }
    }

    static fill_transition_animation_timeline(timeline: Phaser.Tweens.Timeline, transition: [Game_Graphics_Mode, Game_Graphics_Mode], f: Formula_Graphics_Element): number {
        let atom, neg, disj, left_child, right_child, left, right;
        switch(true) {
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Formula_Choice:
                timeline.add({ /* FADE DISJUNCTION */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE DISJUNCTION EMBEDDING */
                    targets: f.get_embedding(),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* CENTER FORMULA ON DISJUNCTION */
                    targets: f.get_children([f]),
                    x: '+='+(-f.x).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* CENTER EMBEDDINGS ON DISJUNCTION */
                    targets: f.get_embedding(true),
                    x: '+='+(-f.x).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            default:
                return 1500;
        }
    }
}
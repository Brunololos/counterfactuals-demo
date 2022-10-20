import { Rule, Rules } from "../../game/Game_Rules";
import { Game_Graphics_Mode } from "../../util/UI_Utils";
import { BRACKET_WIDTH, CONJ_WIDTH, DISJ_WIDTH, Formula_Graphics, Formula_Graphics_Element, ICON_WIDTH, Negation_Graphics } from "../Formula_Graphics";

export class Formula_Animations {
    static fill_animation_timeline(timeline: Phaser.Tweens.Timeline, move: Rules, formula: Formula_Graphics): number {
        let f = formula.get_formula();
        let top, bottom, atom, neg, conj, disj, cf_would, left_child, right_child, left, right;
        switch(move) {
            case Rules.Attacker_Victory:
                return 1500;
            /* case Rules.Defender_Victory:
                let top = formula.add_temporary_formula("_|_");
                top.setTexture("true");
                top.setAlpha(0);
                top.setX(0);
                timeline.add({ FADE NEGATION & BOTTOM
                    targets: [f, f.get_child("l")],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                });
                timeline.add({ FADE NEGATION & BOTTOM
                    targets: [f, f.get_child("l")],
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                });
                timeline.add({ FADE IN TOP
                    targets: top,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Known_Fact:
                neg = formula.add_temporary_formula("~_|_");
                neg.setAlpha(0);
                neg.setX(0);
                bottom = neg.get_child("l");
                bottom.setAlpha(0);
                bottom.setX(0);
                timeline.add({ FADE ATOM
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ MOVE NEGATION
                    targets: neg,
                    x: - ICON_WIDTH/2,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ MOVE BOTTOM
                    targets: bottom,
                    x: ICON_WIDTH/2,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ FADE IN NEGATION & BOTTOM
                    targets: [neg, bottom],
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500; */
            case Rules.Defender_Victory:
                /* top = formula.add_temporary_formula("_|_");
                top.setTexture("true");
                top.setAlpha(1);
                top.setX(0);
                bottom = f.get_child("l");
                f.setAlpha(0);
                bottom.setAlpha(0); */
                return 1500;
            case Rules.Negated_Bottom:
                top = formula.add_temporary_formula("¯|¯");
                top.setAlpha(0);
                top.setX(0);
                bottom = f.get_child("l");
                timeline.add({ /* FADE NEGATION & BOTTOM */
                    targets: [f, bottom],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE NEGATION */
                    targets: f,
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE BOTTOM */
                    targets: bottom,
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN TOP */
                    targets: top,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Negated_Top:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX(0);
                top = f.get_child("l");
                timeline.add({ /* FADE NEGATION & TOP */
                    targets: [f, top],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE NEGATION */
                    targets: f,
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE TOP */
                    targets: top,
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN BOTTOM */
                    targets: bottom,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Known_Fact:
                top = formula.add_temporary_formula("¯|¯");
                top.setAlpha(0);
                top.setX(0);
                timeline.add({ /* FADE ATOM */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN TOP */
                    targets: top,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Unknown_Fact:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX(0);
                timeline.add({ /* FADE ATOM */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN BOTTOM */
                    targets: bottom,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Negated_Known_Fact:
                top = formula.add_temporary_formula("¯|¯");
                top.setAlpha(0);
                top.setX( ICON_WIDTH/2 );
                atom = f.get_child("l");
                timeline.add({ /* FADE ATOM */
                    targets: atom,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN TOP */
                    targets: top,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            /* case Rules.Negated_Known_Fact:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX(0);
                atom = f.get_child("l");
                timeline.add({ FADE NEGATION & ATOM
                    targets: [f, atom],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ MOVE NEGATION
                    targets: f,
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ MOVE ATOM
                    targets: atom,
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ FADE IN BOTTOM
                    targets: bottom,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500; */
            case Rules.Negated_Unknown_Fact:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX( ICON_WIDTH/2 );
                atom = f.get_child("l");
                timeline.add({ /* FADE ATOM */
                    targets: atom,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN BOTTOM */
                    targets: bottom,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            /* case Rules.Negated_Unknown_Fact:
                top = formula.add_temporary_formula("_|_");
                top.setTexture("true");
                top.setAlpha(0);
                top.setX(0);
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX( ICON_WIDTH/2 );
                atom = f.get_child("l");
                timeline.add({ FADE ATOM
                    targets: atom,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ FADE IN BOTTOM
                    targets: bottom,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ FADE NEGATION & BOTTOM
                    targets: [f, bottom],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ MOVE NEGATION
                    targets: f,
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ MOVE BOTTOM
                    targets: bottom,
                    x: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ FADE IN TOP
                    targets: top,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                return 3000; */
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
            case Rules.Left_AND:
                left_child = f.get_child("l");
                right_child = f.get_child("r");
                timeline.add({ /* FADE CONJUNCTION & RIGHT CHILD TREE */
                    targets: right_child.get_children([f, right_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CONJUNCTION & RIGHT_CHILD EMBEDDINGS */
                    targets: f.get_embedding().concat(right_child.get_embedding(true)),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT CHILD */
                    targets: left_child.get_children([left_child]),
                    x: '+='+((f.get_width() - left_child.get_width())/2 - BRACKET_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* MOVE LEFT CHILD EMBEDDINGS */
                    targets: left_child.get_embedding(true),
                    x: '+='+((f.get_width() - left_child.get_width())/2 - BRACKET_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                    return 3000;
                case Rules.Right_AND:
                    left_child = f.get_child("l");
                    right_child = f.get_child("r");
                    timeline.add({ /* FADE CONJUNCTION & LEFT CHILD TREE */
                        targets: left_child.get_children([f, left_child]),
                        alpha: 0,
                        duration: 1500,
                        ease: 'Quart.Out',
                        yoyo: false,
                        repeat: 0,
                        offset: 0
                    });
                    timeline.add({ /* FADE CONJUNCTION & LEFT_CHILD EMBEDDINGS */
                        targets: f.get_embedding().concat(left_child.get_embedding(true)),
                        alpha: 0,
                        duration: 1500,
                        ease: 'Quart.Out',
                        yoyo: false,
                        repeat: 0,
                        offset: 0
                    });
                    timeline.add({ /* MOVE RIGHT CHILD */
                        targets: right_child.get_children([right_child]),
                        x: '+='+((-f.get_width() + right_child.get_width())/2 + BRACKET_WIDTH).toString(),
                        duration: 1500,
                        ease: 'Quart.Out',
                        yoyo: false,
                        repeat: 0,
                        offset: 1500
                    });
                    timeline.add({ /* MOVE RIGHT CHILD EMBEDDINGS */
                        targets: right_child.get_embedding(true),
                        x: '+='+((-f.get_width() + right_child.get_width())/2 + BRACKET_WIDTH).toString(),
                        duration: 1500,
                        ease: 'Quart.Out',
                        yoyo: false,
                        repeat: 0,
                        offset: 1500
                    });
                    return 3000;
                case Rules.Negated_Left_AND:
                    return 1500;
                case Rules.Negated_Left_AND:
                    return 1500;
            case Rules.Attacker_Phi_Evaluation:
                left = f.get_child("l");
                right = f.get_child("r");
                timeline.add({ /* FADE CF_WOULD & CONSEQUENT */
                    targets: right.get_children([f, right]),
                    alpha: 0,
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CF_WOULD & CONSEQUENT EMBEDDINGS */
                    targets: right.get_embedding(true).concat(f.get_embedding()),
                    alpha: 0,
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE ANTECEDENT */
                    targets: left.get_children([left]),
                    x: '+='+((f.get_width() - left.get_width())/2 - BRACKET_WIDTH).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE ANTECEDENT EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+='+((f.get_width() - left.get_width())/2 - BRACKET_WIDTH).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 3000;
            case Rules.Attacker_World_Choice:
                left = f.get_child("l");
                right = f.get_child("r");
                
                disj = formula.add_temporary_formula("~A v B");
                disj.setX( (ICON_WIDTH + left.get_width() - right.get_width())/2);
                disj.setAlpha(0);
                disj.get_embedding()[0].setAlpha(0);
                disj.get_embedding()[1].setAlpha(0);
                disj.get_embedding()[2].setAlpha(0);
                disj.get_child("ll").setAlpha(0);
                disj.get_child("r").setAlpha(0);
                neg = disj.get_child("l");
                neg.setX( - (DISJ_WIDTH + left.get_width() + right.get_width())/2);
                neg.setAlpha(0);
                
                timeline.add({ /* FADE CF_WOULD */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CF_WOULD EMBEDDING */
                    targets: f.get_embedding(),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN NEGATION & DISJUNCTION */
                    targets: [neg, disj],
                    alpha: 1,
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                /* timeline.add({ //FADE IN DISJUNCTION EMBEDDING // TODO: fix Embedding popup in attacker world choice
                    targets: disj.get_embedding(),
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                }); */
                timeline.add({ /* MOVE ANTECEDENT */
                    targets: left.get_children([left]),
                    x: '+=' + ( (f.get_width() - left.get_width())/2 - BRACKET_WIDTH + ( + ICON_WIDTH - right.get_width() - DISJ_WIDTH)/2).toString(),//( (right.get_width() + ICON_WIDTH)/2 + ( - right.get_width() )/2 + BRACKET_WIDTH ).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE ANTECEDENT EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+=' + ( (f.get_width() - left.get_width())/2 - BRACKET_WIDTH + ( + ICON_WIDTH - right.get_width() - DISJ_WIDTH)/2).toString(),//( (right.get_width() + ICON_WIDTH)/2 + ( - right.get_width() )/2 + BRACKET_WIDTH ).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CONSEQUENT */
                    targets: right.get_children([right]),
                    x: '+=' + ( (-f.get_width() + right.get_width())/2 + BRACKET_WIDTH + ( + left.get_width() + ICON_WIDTH + DISJ_WIDTH)/2).toString(),//( ( - left.get_width() - ICON_WIDTH)/2 + (ICON_WIDTH*2 + left.get_width())/2 + BRACKET_WIDTH ).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CONSEQUENT EMBEDDING */
                    targets: right.get_embedding(true),
                    x: '+=' + ( ( - left.get_width() - ICON_WIDTH)/2 + (ICON_WIDTH*2 + left.get_width())/2 + BRACKET_WIDTH ).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                    return 3000;
            case Rules.Attacker_Vacuous_World_Choice:
                neg = formula.add_temporary_formula("~A");
                neg.setX( - f.get_width()/2);
                neg.setAlpha(0);
                atom = neg.get_child("l").setAlpha(0);
                timeline.add({ /* MOVE FORMULA */
                    targets: f.get_children([f]),
                    x: '+='+(ICON_WIDTH/2).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE FORMULA EMBEDDINGS */
                    targets: f.get_embedding(true),
                    x: '+='+(ICON_WIDTH/2).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN NEGATION */
                    targets: neg,
                    alpha: 1,
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 3000;
            case Rules.Attacker_Sphere_Selection:
                
                return 3000;
            case Rules.Attacker_Vacuous_Truth_Claim:
                cf_would = f.get_child("l");
                left = f.get_child("ll");
                right = f.get_child("lr");
                timeline.add({ /* FADE NEGATION, RIGHT CHILDREN & CF_WOULD  */
                    targets: [f, cf_would].concat(right.get_children([right])),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE RIGHT CHILDREN & CF_WOULD EMBEDDINGS */
                    targets: right.get_embedding(true).concat(cf_would.get_embedding()),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT CHILDREN */
                    targets: left.get_children([left]),
                    x: '+=' + ( ( right.get_width() )/2).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT CHILDREN EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+=' + ( ( right.get_width() )/2).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 3000;
            case Rules.Defender_Vacuous_World_Choice:
                return 3000;
            default:
                return 3000;
        }
    }

    static fill_transition_animation_timeline(timeline: Phaser.Tweens.Timeline, transition: [Game_Graphics_Mode, Game_Graphics_Mode], formula: Formula_Graphics): number {
        let f = formula.get_formula();
        let atom, neg, conj, disj, cf_would, left_child, right_child, left, right;
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
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Negated_Formula_Choice:
                conj = f.get_child("l");
                left_child = f.get_child("ll");
                right_child = f.get_child("lr");
                let left_neg = formula.add_temporary_formula("~_|_");
                let right_neg = formula.add_temporary_formula("~_|_");
                left_neg.setX(( - left_child.get_width() - CONJ_WIDTH - right_child.get_width())/2);
                right_neg.setX((left_child.get_width() + CONJ_WIDTH - right_child.get_width())/2);
                left_neg.setAlpha(0);
                right_neg.setAlpha(0);
                left_neg.get_child("l").setAlpha(0);
                right_neg.get_child("l").setAlpha(0);
                timeline.add({ /* FADE NEGATION & CONJUNCTION */
                    targets: [f, conj],
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CONJUNCTION EMBEDDING */
                    targets: conj.get_embedding(),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT & LEFT NEGATION */
                    targets: left_child.get_children([left_child, left_neg]),
                    x: '+='+((f.get_width() - left_child.get_width() - ICON_WIDTH - BRACKET_WIDTH)/2 + (-left_child.get_width() - ICON_WIDTH - BRACKET_WIDTH)/2 - CONJ_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT EMBEDDINGS */
                    targets: left_child.get_embedding(true),
                    x: '+='+((f.get_width() - left_child.get_width() - ICON_WIDTH - BRACKET_WIDTH)/2 + (-left_child.get_width() - ICON_WIDTH - BRACKET_WIDTH)/2 - CONJ_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT & RIGHT NEGATION */
                    targets: right_child.get_children([right_child, right_neg]),
                    x: '+='+((-f.get_width() + right_child.get_width() + ICON_WIDTH + BRACKET_WIDTH)/2 + (ICON_WIDTH + right_child.get_width() + BRACKET_WIDTH)/2 + CONJ_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT EMBEDDINGS */
                    targets: right_child.get_embedding(true),
                    x: '+='+((-f.get_width() + right_child.get_width() + ICON_WIDTH + BRACKET_WIDTH)/2 + (ICON_WIDTH + right_child.get_width() + BRACKET_WIDTH)/2 + CONJ_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN LEFT NEGATION & RIGHT NEGATION */
                    targets: [left_neg, right_neg],
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                /* timeline.add({ MOVE LEFT & RIGHT
                    targets: conj.get_children(),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                }); */
                return 1500;
            /* case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Counterfactual_Choice:
                timeline.add({ MOVE FORMULA TO RIGHT OR POSITION
                    targets: f.get_children([f]),
                    x: '+='+(f.get_width()/2 + ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ MOVE FORMULA EMBEDDING TO RIGHT OR POSITION
                    targets: f.get_embedding(true),
                    x: '+='+(f.get_width()/2 + ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Negated_Counterfactual_Choice:
                cf_would = f.get_child("l");
                left = f.get_child("ll");
                right = f.get_child("lr");

                neg = formula.add_temporary_formula("~(A v B)");
                neg.setX( + ICON_WIDTH*2 + BRACKET_WIDTH );
                neg.setAlpha(0);
                disj = neg.get_child("l");
                disj.setX( + ICON_WIDTH*3 + left.get_width() + BRACKET_WIDTH );
                disj.setAlpha(0);
                let emb = disj.get_embedding();
                emb[0].setX( + ICON_WIDTH*3 + left.get_width() + BRACKET_WIDTH - left.get_width() - ICON_WIDTH - BRACKET_WIDTH );
                emb[1].setX( + cf_would.get_width()/2 + ICON_WIDTH*2 );
                emb[2].setX( + ICON_WIDTH*3 + left.get_width() + BRACKET_WIDTH + right.get_width() + BRACKET_WIDTH );
                emb[1].setScale( (cf_would.get_width() - ICON_WIDTH)/ICON_WIDTH, 1 );
                emb[0].setAlpha(0);
                emb[1].setAlpha(0);
                emb[2].setAlpha(0);
                formula.sendToBack(emb[0]);
                formula.sendToBack(emb[1]);
                formula.sendToBack(emb[2]);
                disj.get_child("l").setAlpha(0);
                disj.get_child("r").setAlpha(0);

                timeline.add({ FADE CF_WOULD
                    targets: cf_would,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ MOVE NEGATION
                    targets: f,
                    x: '+='+((f.get_width() - ICON_WIDTH)/2 + ICON_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ MOVE LEFT & RIGHT
                    targets: cf_would.get_children(),
                    x: '+='+(( - ICON_WIDTH)/2 + cf_would.get_width()/2 + ICON_WIDTH*2.5 ).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ MOVE CF_WOULD EMBEDDINGS
                    targets: cf_would.get_embedding(true),
                    x: '+='+(( - ICON_WIDTH)/2 + cf_would.get_width()/2 + ICON_WIDTH*2.5 ).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ FADE CF_WOULD EMBEDDING
                    targets: cf_would.get_embedding(),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ FADE IN NEGATION & DISJUNCTION
                    targets: [neg, disj],
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ FADE IN EMBEDDING
                    targets: disj.get_embedding(),
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                return 3000; */
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Sphere_Selection:
                return 0;
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Counterfactual_World_Choice:
                return 0;
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Vacuous_World_Choice:
                return 0;
            default:
                return 1500;
        }
    }
}
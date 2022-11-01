import { Rule, Rules } from "../../game/Game_Rules";
import { Game_Graphics_Mode } from "../../util/UI_Utils";
import { BRACKET_WIDTH, CONJ_WIDTH, DISJ_WIDTH, Formula_Graphics, Formula_Graphics_Element, ICON_WIDTH, Negation_Graphics } from "../Formula_Graphics";

export class Formula_Animations {
    static fill_animation_timeline(timeline: Phaser.Tweens.Timeline, move: Rules, formula: Formula_Graphics): number {
        let f = formula.get_formula();
        let top, bottom, atom, neg, conj, disj, ness, poss, cf_would, left_child, right_child, left, right;
        switch(move) {
            case Rules.Attacker_Victory:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setTexture("loss");
                bottom.setAlpha(0);
                bottom.setX(0);
                timeline.add({ /* FADE TOP */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN LOSS */
                    targets: bottom,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Defender_Victory:
                top = formula.add_temporary_formula("_|_");
                top.setTexture("win");
                top.setAlpha(0);
                top.setX(0);
                timeline.add({ /* FADE TOP */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN WIN */
                    targets: top,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;

            case Rules.Attacker_Landing:
                return 1000;
            case Rules.Defender_Landing:
                return 1000;
            case Rules.Attacker_Stranding:
                return 1000;
            case Rules.Defender_Stranding:
                return 1000;
            
            case Rules.Attacker_Known_Fact:
            case Rules.Defender_Known_Fact:
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
            case Rules.Attacker_Unknown_Fact:
            case Rules.Defender_Unknown_Fact:
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
            case Rules.Attacker_Negation:
            case Rules.Defender_Negation:
                left = f.get_child("l");
                timeline.add({ /* FADE NEGATION */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHILDREN */
                    targets: left.get_children([left]),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Attacker_Left_OR:
                left_child = f.get_child("l");
                right_child = f.get_child("r");
                timeline.add({ /* FADE DISJUNCTION & RIGHT CHILD TREE */
                    targets: right_child.get_children([f, right_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE DISJUNCTION & RIGHT_CHILD EMBEDDINGS */
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
            case Rules.Attacker_Right_OR:
                left_child = f.get_child("l");
                right_child = f.get_child("r");
                timeline.add({ /* FADE DISJUNCTION & LEFT CHILD TREE */
                    targets: left_child.get_children([f, left_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE DISJUNCTION & LEFT_CHILD EMBEDDINGS */
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
            case Rules.Defender_Left_OR:
            case Rules.Defender_Right_OR:
                return 1500;
            case Rules.Attacker_Left_AND:
            case Rules.Attacker_Right_AND:
                return 1000; // TODO: Need be 1500?
            case Rules.Defender_Left_AND:
                left_child = f.get_child("l");
                right_child = f.get_child("r");

                timeline.add({ /* CENTER FORMULA ON CONJUNCTION */
                    targets: f.get_children([f]),
                    x: '+='+(-f.x).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* CENTER EMBEDDINGS ON CONJUNCTION */
                    targets: f.get_embedding(true),
                    x: '+='+(-f.x).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CONJUNCTION & RIGHT CHILD TREE */
                    targets: right_child.get_children([f, right_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* FADE CONJUNCTION & RIGHT_CHILD EMBEDDINGS */
                    targets: f.get_embedding().concat(right_child.get_embedding(true)),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* MOVE LEFT CHILD */
                    targets: left_child.get_children([left_child]),
                    x: '+='+((f.get_width() - left_child.get_width())/2 - BRACKET_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 3000
                });
                timeline.add({ /* MOVE LEFT CHILD EMBEDDINGS */
                    targets: left_child.get_embedding(true),
                    x: '+='+((f.get_width() - left_child.get_width())/2 - BRACKET_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 3000
                });
                return 4500;
            case Rules.Defender_Right_AND:
                left_child = f.get_child("l");
                right_child = f.get_child("r");

                timeline.add({ /* CENTER FORMULA ON CONJUNCTION */
                    targets: f.get_children([f]),
                    x: '+='+(-f.x).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* CENTER EMBEDDINGS ON CONJUNCTION */
                    targets: f.get_embedding(true),
                    x: '+='+(-f.x).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CONJUNCTION & LEFT CHILD TREE */
                    targets: left_child.get_children([f, left_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* FADE CONJUNCTION & LEFT_CHILD EMBEDDINGS */
                    targets: f.get_embedding().concat(left_child.get_embedding(true)),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1500
                });
                timeline.add({ /* MOVE RIGHT CHILD */
                    targets: right_child.get_children([right_child]),
                    x: '+='+((-f.get_width() + right_child.get_width())/2 + (left_child.get_width() - right_child.get_width())/2 + BRACKET_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 3000
                });
                timeline.add({ /* MOVE RIGHT CHILD EMBEDDINGS */
                    targets: right_child.get_embedding(true),
                    x: '+='+((-f.get_width() + right_child.get_width())/2 + (left_child.get_width() - right_child.get_width())/2 + BRACKET_WIDTH).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 3000
                });
                return 4500;
            case Rules.Attacker_Possibility:
                left = f.get_child("l");
                timeline.add({ /* FADE POSSIBILITY */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHILDREN */
                    targets: left.get_children([left]),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Attacker_Vacuous_Possibility: // TODO:
                return 1500;
            case Rules.Defender_Possibility:
                left = f.get_child("l");
                timeline.add({ /* FADE POSSIBILITY */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHILDREN */
                    targets: left.get_children([left]),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Defender_Vacuous_Possibility: // TODO:
                return 1500;
            case Rules.Attacker_Necessity:
                left = f.get_child("l");
                timeline.add({ /* FADE MODAL OPERATOR */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHILDREN */
                    targets: left.get_children([left]),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Attacker_Vacuous_Necessity: // TODO:
                return 1500;
            case Rules.Defender_Necessity:
                left = f.get_child("l");
                timeline.add({ /* FADE MODAL OPERATOR */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CHILDREN */
                    targets: left.get_children([left]),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+='+(-ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Defender_Vacuous_Necessity: // TODO:
                return 1500;

            case Rules.Defender_Might_Sphere_Selection:
                return 1500;
            case Rules.Defender_Vacuous_Might_Sphere_Selection:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX(0);
                timeline.add({ /* FADE FORMULA */
                    targets: f.get_children([f]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE FORMULA EMBEDDINGS */
                    targets: f.get_embedding(true),
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
            case Rules.Attacker_Might_Target_Evaluation:
                left = f.get_child("l");
                right = f.get_child("r");
                conj = formula.add_temporary_formula("_|_");
                conj.setTexture("conjunction");
                conj.setAlpha(0);
                conj.setX(0);
                timeline.add({ /* FADE CF_MIGHT */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT */
                    targets: left.get_children([left]),
                    x: '+=' + ((ICON_WIDTH - CONJ_WIDTH)/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+=' + ((ICON_WIDTH - CONJ_WIDTH)/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT */
                    targets: right.get_children([right]),
                    x: '-=' + ((ICON_WIDTH - CONJ_WIDTH)/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT EMBEDDINGS */
                    targets: right.get_embedding(true),
                    x: '-=' + ((ICON_WIDTH - CONJ_WIDTH)/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CF_MIGHT LEFT EMBEDDING */
                    targets: f.get_embedding()[0],
                    x: '+=' + ((ICON_WIDTH - CONJ_WIDTH)/2 + BRACKET_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CF_MIGHT RIGHT EMBEDDING */
                    targets: f.get_embedding()[2],
                    x: '-=' + ((ICON_WIDTH - CONJ_WIDTH)/2 + BRACKET_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN CONJUNCTION */
                    targets: conj,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500; // TODO: extend to 3000
            case Rules.Attacker_Might_Closer_Phi_World:
                left = f.get_child("l");
                right = f.get_child("r");
                neg = formula.add_temporary_formula("_|_");
                neg.setTexture("negation");
                neg.setAlpha(0);
                neg.setX(-f.get_child("l").get_width()/2);
                timeline.add({ /* FADE CF_MIGHT & RIGHT */
                    targets: right.get_children([f, right]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CF_MIGHT & RIGHT EMBEDDINGS */
                    targets: right.get_embedding(true).concat(f.get_embedding()),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT */
                    targets: left.get_children([left]),
                    x: '+=' + ((right.get_width() + ICON_WIDTH)/2 + ICON_WIDTH/2).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+=' + ((right.get_width() + ICON_WIDTH)/2 + ICON_WIDTH/2).toString(),
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
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 3000;

            case Rules.Attacker_Might_Sphere_Selection:
                return 1500;
            case Rules.Attacker_Vacuous_Might_Sphere_Selection:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX(0);
                timeline.add({ /* FADE FORMULA */
                    targets: f.get_children([f]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE FORMULA EMBEDDINGS */
                    targets: f.get_embedding(true),
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
            case Rules.Defender_Might_Target_Evaluation: // TODO:
                left = f.get_child("l");
                right = f.get_child("r");
                conj = formula.add_temporary_formula("_|_");
                conj.setTexture("conjunction");
                conj.setAlpha(0);
                conj.setX(0);
                timeline.add({ /* FADE CF_MIGHT */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT */
                    targets: left.get_children([left]),
                    x: '+=' + ((ICON_WIDTH - CONJ_WIDTH)/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+=' + ((ICON_WIDTH - CONJ_WIDTH)/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT */
                    targets: right.get_children([right]),
                    x: '-=' + ((ICON_WIDTH - CONJ_WIDTH)/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT EMBEDDINGS */
                    targets: right.get_embedding(true),
                    x: '-=' + ((ICON_WIDTH - CONJ_WIDTH)/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CF_MIGHT LEFT EMBEDDING */
                    targets: f.get_embedding()[0],
                    x: '+=' + ((ICON_WIDTH - CONJ_WIDTH)/2 + BRACKET_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CF_MIGHT RIGHT EMBEDDING */
                    targets: f.get_embedding()[2],
                    x: '-=' + ((ICON_WIDTH - CONJ_WIDTH)/2 + BRACKET_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN CONJUNCTION */
                    targets: conj,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Defender_Might_Closer_Phi_World:
                left = f.get_child("l");
                right = f.get_child("r");
                neg = formula.add_temporary_formula("_|_");
                neg.setTexture("negation");
                neg.setAlpha(0);
                neg.setX(-f.get_child("l").get_width()/2);
                timeline.add({ /* FADE CF_MIGHT & RIGHT */
                    targets: right.get_children([f, right]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CF_MIGHT & RIGHT EMBEDDINGS */
                    targets: right.get_embedding(true).concat(f.get_embedding()),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT */
                    targets: left.get_children([left]),
                    x: '+=' + ((right.get_width() + ICON_WIDTH)/2 + ICON_WIDTH/2).toString(),
                    duration: 3000,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+=' + ((right.get_width() + ICON_WIDTH)/2 + ICON_WIDTH/2).toString(),
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
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 3000;
            case Rules.Attacker_Would_Sphere_Selection:
                return 1500;
            case Rules.Attacker_Vacuous_Would_Sphere_Selection:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX(0);
                timeline.add({ /* FADE FORMULA */
                    targets: f.get_children([f]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE FORMULA EMBEDDINGS */
                    targets: f.get_embedding(true),
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
            case Rules.Defender_Would_Target_Evaluation:
                left = f.get_child("l");
                right = f.get_child("r");
                disj = formula.add_temporary_formula("_|_");
                disj.setTexture("disjunction");
                disj.setAlpha(0);
                disj.setX(left.get_width()/2 + ICON_WIDTH/2 - right.get_width()/2);
                neg = formula.add_temporary_formula("_|_");
                neg.setTexture("negation");
                neg.setAlpha(0);
                neg.setX(-left.get_width()/2 - DISJ_WIDTH/2 - right.get_width()/2);
                timeline.add({ /* FADE CF_MIGHT */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT */
                    targets: left.get_children([left]),
                    x: '+=' + ((ICON_WIDTH - DISJ_WIDTH)/2 + ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+=' + ((ICON_WIDTH - DISJ_WIDTH)/2 + ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT */
                    targets: right.get_children([right]),
                    x: '-=' + ((ICON_WIDTH - DISJ_WIDTH)/2 - ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT EMBEDDINGS */
                    targets: right.get_embedding(true),
                    x: '-=' + ((ICON_WIDTH - DISJ_WIDTH)/2 - ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CF_MIGHT LEFT EMBEDDING */
                    targets: f.get_embedding()[0],
                    x: '+=' + ((ICON_WIDTH - DISJ_WIDTH)/2 - ICON_WIDTH/2 + BRACKET_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CF_MIGHT RIGHT EMBEDDING */
                    targets: f.get_embedding()[2],
                    x: '-=' + ((ICON_WIDTH - DISJ_WIDTH)/2 - ICON_WIDTH/2 + BRACKET_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN NEGATION */
                    targets: neg,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN DISJUNCTION */
                    targets: disj,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Defender_Would_Closer_Phi_World: // TODO:
                left_child = f.get_child("l");
                right_child = f.get_child("r");
                timeline.add({ /* FADE CF_WOULD & RIGHT CHILD TREE */
                    targets: right_child.get_children([f, right_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CF_WOULD & RIGHT_CHILD EMBEDDINGS */
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
            case Rules.Defender_Would_Sphere_Selection:
                return 1500;
            case Rules.Defender_Vacuous_Would_Sphere_Selection:
                bottom = formula.add_temporary_formula("_|_");
                bottom.setAlpha(0);
                bottom.setX(0);
                timeline.add({ /* FADE FORMULA */
                    targets: f.get_children([f]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE FORMULA EMBEDDINGS */
                    targets: f.get_embedding(true),
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
            case Rules.Attacker_Would_Target_Evaluation:
                left = f.get_child("l");
                right = f.get_child("r");
                disj = formula.add_temporary_formula("_|_");
                disj.setTexture("disjunction");
                disj.setAlpha(0);
                disj.setX(left.get_width()/2 + ICON_WIDTH/2 - right.get_width()/2);
                neg = formula.add_temporary_formula("_|_");
                neg.setTexture("negation");
                neg.setAlpha(0);
                neg.setX(-left.get_width()/2 - DISJ_WIDTH/2 - right.get_width()/2);
                timeline.add({ /* FADE CF_MIGHT */
                    targets: f,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT */
                    targets: left.get_children([left]),
                    x: '+=' + ((ICON_WIDTH - DISJ_WIDTH)/2 + ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE LEFT EMBEDDINGS */
                    targets: left.get_embedding(true),
                    x: '+=' + ((ICON_WIDTH - DISJ_WIDTH)/2 + ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT */
                    targets: right.get_children([right]),
                    x: '-=' + ((ICON_WIDTH - DISJ_WIDTH)/2 - ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE RIGHT EMBEDDINGS */
                    targets: right.get_embedding(true),
                    x: '-=' + ((ICON_WIDTH - DISJ_WIDTH)/2 - ICON_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CF_MIGHT LEFT EMBEDDING */
                    targets: f.get_embedding()[0],
                    x: '+=' + ((ICON_WIDTH - DISJ_WIDTH)/2 - ICON_WIDTH/2 + BRACKET_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* MOVE CF_MIGHT RIGHT EMBEDDING */
                    targets: f.get_embedding()[2],
                    x: '-=' + ((ICON_WIDTH - DISJ_WIDTH)/2 - ICON_WIDTH/2 + BRACKET_WIDTH/2).toString(),
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN NEGATION */
                    targets: neg,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE IN DISJUNCTION */
                    targets: disj,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Quart.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                return 1500;
            case Rules.Attacker_Would_Closer_Phi_World:
                left_child = f.get_child("l");
                right_child = f.get_child("r");
                timeline.add({ /* FADE CF_WOULD & RIGHT CHILD TREE */
                    targets: right_child.get_children([f, right_child]),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quart.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 0
                });
                timeline.add({ /* FADE CF_WOULD & RIGHT_CHILD EMBEDDINGS */
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
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Sphere_Selection:
                return 0;
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Counterfactual_World_Choice:
                return 0;
            case transition[0] == Game_Graphics_Mode.Formula && transition[1] == Game_Graphics_Mode.Vacuous_World_Choice:
                return 0;
            case transition[0] == Game_Graphics_Mode.Possibility_World_Choice && transition[1] == Game_Graphics_Mode.Formula:
            case transition[0] == Game_Graphics_Mode.Necessity_World_Choice && transition[1] == Game_Graphics_Mode.Formula:
                return 0;
            default:
                return 1500;
        }
    }
}
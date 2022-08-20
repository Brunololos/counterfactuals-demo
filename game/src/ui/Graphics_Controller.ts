import { Game_Controller } from "../game/Game_Controller";
import { Rule, Rules } from "../game/Game_Rules";
import { Game_Turn_Type } from "../util/Game_Utils";
import { Supposition_Panel } from "./Supposition_Panel";
import { Cf_Logic_Vis } from "./Cf_Logic_Vis";

/**
 * A class governing the visual representation of the abstract game of counterfactuals
 */
export class Graphics_Controller {
    private sup_panel: Supposition_Panel;
    private formula_vis: Cf_Logic_Vis;
    /*
    Graph vis class
    Formula vis class
    Choice class
    */
    constructor(scene: Phaser.Scene) {
        this.sup_panel = new Supposition_Panel(scene, 350, 400);

        this.formula_vis = new Cf_Logic_Vis(scene, "~~(~(A v B) v C)", 350, 400); //TODO: sup_panel coords + offset
        //scene.children.add(this.sup_panel);
        //scene.children.add(this.formula_vis);
    }

    animate_move(move: Rule) {
        //this.formula_vis.animate(move.apply(this.game.get_state()).get_formula().to_string());
    }

    /*start() {
        this.formula_vis.animate("~~(~(A v B) v C)");
        this.formula_vis.animate("(~(A v B) v C)");
        this.formula_vis.animate("~(A v B) v C");
        this.formula_vis.animate("~(A v B)");
        this.formula_vis.animate("(A v B)");
        this.formula_vis.animate("A v B");
        this.formula_vis.animate("A");
    }

    get_next_task() {

    }*/
}
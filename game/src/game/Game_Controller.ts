import { Rules_Controller, Rules, Rule } from "./Game_Rules";
import { Game_State } from "./Game_State";
import { Game_Turn_Type } from "../util/Game_Utils";
import { cloneDeep } from "lodash";

export class Game_Controller {
    private rules_controller: Rules_Controller;
    private state: Game_State;

    constructor(state: Game_State) {
        this.rules_controller = new Rules_Controller();
        this.state = state;
        console.log(this.state.get_formula());
    }

    determine_next_moves(): [Game_Turn_Type, Rule[]] {
        let def_moves = this.rules_controller.defender_moves(this.state);
        let att_moves = this.rules_controller.attacker_moves(this.state);

        switch(true) {
            case def_moves.length > 1:
                // Defenders Choice --> Graphics_Controller
                return [Game_Turn_Type.Defenders_Choice, def_moves]
            case def_moves.length == 1:
                // Singular Defenders Move --> Graphics_Controller
                return [Game_Turn_Type.Defenders_Resolution, def_moves]
            case def_moves.length == 0 && att_moves.length > 1:
                // Attackers Choice --> Graphics Controller
                // TODO: call AI and decide which rule to apply (For now we simply take the first available rule)
                return [Game_Turn_Type.Attackers_Resolution, att_moves.slice(0,1)]
            case def_moves.length == 0 && att_moves.length == 1:
                // Singular Attackers Move --> Graphics Controller
                return [Game_Turn_Type.Attackers_Resolution, att_moves]

                // TODO: Check when executing move
                // Check if move is deterministic or if AI necessary
        }
        return [Game_Turn_Type.No_Moves, []]
    }

    execute_move(move: Rule) {
        let applicable = this.rules_controller.applicable(this.state);

        console.log("[" + this.rules_controller.applicable(this.state).map((value: Rule) => Rules[value.get_name()]).reduce((previous: string, current: string) => previous + ", " + current) + "]");
        
        if(applicable.length == 0) { console.log("No applicable Rule"); return; }

        this.state = applicable[0].apply(this.state);

        console.log(this.state.get_formula());
    }

    get_state(): Game_State {
        return cloneDeep(this.state);
    }
}
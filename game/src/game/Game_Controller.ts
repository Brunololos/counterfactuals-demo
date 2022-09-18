import { Rules_Controller, Rules, Rule } from "./Game_Rules";
import { Game_State } from "./Game_State";
import { Game_Turn_Type, State_Mode } from "../util/Game_Utils";
import { cloneDeep } from "lodash";
import { Attacker_AI } from "./Attacker_AI";

export class Game_Controller {
    private rules_controller: Rules_Controller;
    private state: Game_State;

    constructor(state: Game_State) {
        this.rules_controller = new Rules_Controller();
        this.state = state;
        console.log("Setup Game with Formula: "+this.state.get_formula().to_string());
    }

    determine_next_moves(): [Game_Turn_Type, Rule[], integer?] {
        let def_moves = this.rules_controller.defender_moves(this.state);
        let att_moves = this.rules_controller.attacker_moves(this.state);
        let att_move;

        switch(true) {
            case def_moves.length > 1:
                return [Game_Turn_Type.Defenders_Choice, def_moves]

            case def_moves.length == 1:
                return [Game_Turn_Type.Defenders_Resolution, def_moves]

            case def_moves.length == 0 && att_moves.length > 1:
                att_move = Attacker_AI.choose_move(cloneDeep(this.state), att_moves);
                return [Game_Turn_Type.Attackers_Resolution, [att_move[0]], att_move[1]];

            case def_moves.length == 0 && att_moves.length == 1:
                att_move = Attacker_AI.choose_move(cloneDeep(this.state), att_moves);
                return [Game_Turn_Type.Attackers_Resolution, [att_move[0]], att_move[1]];

            case def_moves.length == 0 && att_moves.length == 0:
                return [Game_Turn_Type.No_Moves, []];
        }
        return [Game_Turn_Type.No_Moves, []];
    }

    execute_move(move: Rule, world?: integer) {
        this.state = move.apply(this.state, world);
        let mode = this.state.get_mode();
        switch(mode) {
            case State_Mode.Resolve:
                console.log("---> " + this.state.get_formula().to_string()+" at world "+this.state.get_current_world().index);
                break;
            case State_Mode.Counterfactual:
                console.log("---> Prove counterfactual " + this.state.get_formula().to_string() + "\nwithin sphere centered on world "+this.state.get_current_world().index+" delimited by world " + this.state.get_delim_world().index);
                break;
        }
    }

    does_require_delim(rule: Rule): boolean {
        return rule.get_world_input_requirement();
    }

    get_state(): Game_State {
        return cloneDeep(this.state);
    }
}
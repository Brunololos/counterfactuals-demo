import { State_Mode } from "../util/Game_Utils";
import { Rules_Controller, Rules, Rule } from "./Game_Rules";
import { Game_State } from "./Game_State";

export class Attacker_AI {

    // TODO: Replace "random" AI calls
    static choose_move(state: Game_State, moves: Rule[]): [Rule, integer] {
        let move = this.choose_random_move(moves);
        let delim_distance = (state.get_mode() == State_Mode.Counterfactual) ? state.get_radius() : Infinity;
        let world = move.get_world_input_requirement() ? Attacker_AI.choose_random_reachable_world(state, move, delim_distance) : -1;
        return [move, world];
    }

    static choose_random_move(moves: Rule[]): Rule {
        let min = Math.ceil(0);
        let max = Math.floor(moves.length);
        let random_index = Math.floor(Math.random() * (max - min) + min);
        return moves[random_index];
    }

    static choose_random_reachable_world(state: Game_State, move: Rule, delim_distance: number = Infinity): integer {
        if(!move.get_world_input_requirement()) { throw new Error("Passed move doesnt require world input!"); }

        let world = state.get_current_world();
        let reachable_worlds = world.get_edges().filter((value) => value[1] <= delim_distance);

        let min = Math.ceil(0);
        let max = Math.floor(reachable_worlds.length);
        let random_index = Math.floor(Math.random() * (max - min) + min);
        console.log("AI chose world "+reachable_worlds[random_index][0].index);
        return reachable_worlds[random_index][0].index;
    }

}
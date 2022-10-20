import { cloneDeep } from "lodash";
import { State_Mode } from "../util/Game_Utils";
import { Rules_Controller, Rules, Rule } from "./Game_Rules";
import { Game_State } from "./Game_State";

export class Attacker_AI {

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

    static choose_blunderscore_move(state: Game_State, moves: Rule[], rc: Rules_Controller): [Rule, integer] {
        let queue: Game_State[] = [state];
        let expanded: Game_State[] = [];
        let blunderscores: [Game_State, number, number][] = [];

        while(queue.length > 0) {
            let current = queue[queue.length-1] as Game_State;

            // expand node
            let did_expand = false;
            let states = rc.next_game_states(current);
            //console.log("Read "+current.to_string()+" from queue with length "+queue.length+":");


            let next;
            if(!expanded.some((value) => value.equals(current))) {
                //console.log("Expanded State by:");
                expanded.push(current);
                did_expand = true;
                //console.log(queue.map((value) => value.to_string()));
                for(let i=0; i<states.length; i++) {
                    next = states[i];
                    //console.log(cloneDeep(expanded).map((value) => value.to_string()));
                    if(!expanded.some((value) => value.equals(next))) {
                        if(queue.some((value) => value.equals(next))) {
                            queue = queue.filter((value) => !value.equals(next));
                        }
                        queue.push(next);
                        //console.log(next.to_string());
                    }
                }
            }

            // process node
            if(!did_expand) {
                //console.log("Didnt Expand --> Processing State");
                let att_moves = rc.attacker_moves(current);
                let def_moves = rc.defender_moves(current);
                switch(true) {
                    case att_moves.some((value) => value.get_name() == Rules.Defender_Victory):
                        //console.log("Adding State to Defenders winning region...");
                        blunderscores.push([current, 1, 0]);
                        break;
                    case att_moves.some((value) => value.get_name() == Rules.Attacker_Victory):
                        //console.log("Adding State to Attackers winning region...");
                        blunderscores.push([current, 0, 0]);
                        break;
                    case def_moves.length > 0:
                        //console.log("Passing mean of Defender Choices bs-values...");
                        let score = 0;
                        let dec = 0;
                        for(let i=0; i<states.length; i++) {
                            next = states[i];
                            /* console.log(next.to_string());
                            console.log(states.map((value) => value.to_string()));
                            console.log(blunderscores.map((value) => value[0].to_string())); */
                            let bs_entry = blunderscores.find((value) => value[0].equals(next))!;
                            score += bs_entry[1];
                            dec += bs_entry[2];
                        }
                        blunderscores.push([current, score/states.length, dec/states.length + 1]);
                        break;
                    case att_moves.length > 0:
                        //console.log("Passing best Attacker Choice bs-value...");
                        let min = Infinity;
                        let min_dec = 0;
                        for(let i=0; i<states.length; i++) {
                            next = states[i];
                            let bs_entry = blunderscores.find((value) => value[0].equals(next))!;
                            let bs = bs_entry[1];
                            if(bs < min) {
                                min = bs;
                                min_dec = bs_entry[2];
                            } else if(bs == min && min_dec < bs_entry[2]) {
                                min = bs;
                                min_dec = bs_entry[2];
                            }
                        }
                        blunderscores.push([current, min, min_dec]);
                        break;
                }
                //console.log(blunderscores.map((value) => value[0].to_string() + " => " + value[1] + ", " + value[2]));
                queue.pop();
            }
        }
        /* console.log("Ended calculation with blunderscores:");
        console.log(blunderscores.map((value) => "[" + value[0].to_string() + ", " + value[1] + ", " + value[2] + "]"));
        console.log(blunderscores); */

        // find best move evaluation
        let chosen_move;
        let chosen_world = -1;
        let best_blunderscore = Infinity;
        let best_decisioncount = -1;
        let next;
        for(let i=0; i<moves.length; i++) {
            let move = moves[i];
            next = rc.next_game_states(state, [move]);
            //console.log(next);
            for(let j=0; j<next.length; j++) {
                let score = blunderscores.find((value) => value[0].equals(next[j]));
                //console.log(score);
                if(score == undefined) { continue; }
                if(score[1] < best_blunderscore) {
                    chosen_move = move;
                    chosen_world = (move.get_name() == Rules.Attacker_Sphere_Selection) ? next[j].get_delim_world().index : next[j].get_current_world().index;
                    best_blunderscore = score[1];
                    best_decisioncount = score[2];
                } else if(score[1] == best_blunderscore && score[2] > best_decisioncount) {
                    chosen_move = move;
                    chosen_world = (move.get_name() == Rules.Attacker_Sphere_Selection) ? next[j].get_delim_world().index : next[j].get_current_world().index;
                    best_blunderscore = score[1];
                    best_decisioncount = score[2];

                }
            }
        }
        return [chosen_move, chosen_world];
    }

}
import { Graph, World } from "./Graph"
import { Formula } from "./Cf_Logic";
import { Player, State_Mode } from "./Game_Utils"
import {cloneDeep} from 'lodash';

export class Game_State {
    private mode: State_Mode;
    private similarity_graph: Graph;
    private supposition: Formula;
    private current_world: integer;
    private active_player: Player;

    // Counterfactual mode properites
    private delim_world: integer;       // sphere delimiting phi-world
    private r: number;                  // distance between current_world and delim_world

    constructor(mode: State_Mode, graph: Graph, supposition: Formula, current_world: integer, active_player: Player, delim_world?: integer) {
        this.mode = mode;
        this.similarity_graph = graph;
        this.active_player = active_player;
        this.supposition = supposition;
        this.current_world = current_world;

        let v = graph.get_world(current_world);
        if(mode == State_Mode.Counteractual && delim_world !== undefined && v.is_adj(delim_world)) {
            this.delim_world = delim_world;
            this.r = v.get_edge(delim_world)[1];
        } else { throw new Error("Counterfactual Mode requires you to pass a valid delim_world"); }
    }

    get_mode(): State_Mode {
        return this.mode;
    }

    get_formula(): Formula {
        return cloneDeep(this.supposition);
    }

    get_current_world(): World {
        return this.similarity_graph.get_world(this.current_world);
    }

    get_active_player(): Player {
        return this.active_player;
    }

}
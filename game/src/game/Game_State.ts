import { Graph, World } from "../util/Graph"
import { Formula } from "../util/Cf_Logic";
import { Player, State_Mode, Player_Abbreviations, State_Mode_Abbreviations } from "../util/Game_Utils"
import {cloneDeep} from 'lodash';

export class Game_State {
    private mode: State_Mode;
    private similarity_graph: Graph;
    private supposition: Formula;
    private current_world: integer;
    private active_player: Player;

    // Counterfactual mode properites
    private delim_world: integer = 0;       // sphere delimiting phi-world
    private r: number = 0;                  // distance between current_world and delim_world

    constructor(mode: State_Mode, graph: Graph, supposition: Formula, current_world: integer, active_player: Player, delim_world?: integer) {
        this.mode = mode;
        this.similarity_graph = graph;
        this.active_player = active_player;
        this.supposition = supposition;
        this.current_world = current_world;

        let v = graph.get_world(current_world);
        if(mode == State_Mode.Counterfactual) {
            if((delim_world == undefined || !v.is_adj(delim_world))) {
                throw new Error("Counterfactual Mode requires you to pass a valid delim_world");
            } else {
                this.delim_world = delim_world;
                this.r = v.get_edge(delim_world)[1];
            }
        }
    }

    static create(mode: string, graph: Graph, supposition: string, atoms: string[], current_world: integer, player: string, delim_world?: integer): Game_State {
        let state_mode: State_Mode | undefined = State_Mode_Abbreviations.get(mode);
        let active_player: Player | undefined = Player_Abbreviations.get(player);
        let formula_supposition: Formula = Formula.parse(supposition, atoms);

        if(state_mode == undefined || formula_supposition == undefined || active_player == undefined) {
            throw new Error("Passed incorrect State_Mode, Formula or Player string abbreviation");
        }

        return new Game_State(state_mode, graph, formula_supposition, current_world, active_player, delim_world);
    }

    configure(mode: string, supposition: Formula, player: string, current_world?: integer, delim_world?: integer): Game_State {
        this.mode = State_Mode_Abbreviations.get(mode) ?? this.mode;
        this.supposition = supposition;
        this.active_player = Player_Abbreviations.get(player) ?? this.active_player;
        this.current_world = current_world || this.current_world;
        this.delim_world = delim_world || this.delim_world;
        return this;
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

    get_delim_world(): World {
        if(this.mode != State_Mode.Counterfactual) { throw new Error("Game_State has no property delim_world in the current mode"); }
        return this.similarity_graph.get_world(this.delim_world);
    }

    get_radius(): number {
        if(this.mode != State_Mode.Counterfactual) { throw new Error("Game_State has no property radius in the current mode"); }
        return this.r;
    }

}
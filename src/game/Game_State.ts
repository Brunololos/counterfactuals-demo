import { Graph, World } from "../util/Graph"
import { Formula } from "./Cf_Logic";
import { Player, State_Mode, Player_Abbreviations, State_Mode_Abbreviations } from "../util/Game_Utils"
import {cloneDeep} from 'lodash';

export class Game_State {
    private mode: State_Mode;
    private similarity_graph: Graph;
    private supposition: Formula;
    private current_world: integer;
    private active_player: Player;
    private atoms: string[];

    // Counterfactual mode properites
    private delim_world: integer = 0;       // sphere delimiting phi-world
    private r: number = Infinity;           // distance between current_world and delim_world

    constructor(mode: State_Mode, graph: Graph, supposition: Formula, current_world: integer, active_player: Player, atoms: string[], delim_world?: integer) {
        this.mode = mode;
        this.similarity_graph = graph;
        this.active_player = active_player;
        this.supposition = supposition;
        this.current_world = current_world;
        this.atoms = atoms;

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

        return new Game_State(state_mode, graph, formula_supposition, current_world, active_player, atoms, delim_world);
    }

    configure(mode: string, supposition: Formula, player: string, current_world?: integer, delim_world?: integer): Game_State {
        let new_mode = State_Mode_Abbreviations.get(mode) ?? this.mode;
        let new_supposition = cloneDeep(supposition);
        let new_active_player = Player_Abbreviations.get(player) ?? this.active_player;
        let new_current_world = current_world || this.current_world;
        let new_delim_world = delim_world || this.delim_world;
        return new Game_State(new_mode, this.get_graph(), new_supposition, new_current_world, new_active_player, this.atoms, new_delim_world);
    }

    equals(state: Game_State): boolean {
        if(this.mode != state.get_mode()) { return false; }
        if(!this.similarity_graph.equals(state.get_graph())) { return false; }
        if(!this.supposition.compare(state.get_formula())) { return false; }
        if(this.current_world != state.get_current_world().index) { return false; }
        if(this.active_player != state.get_active_player()) { return false; }
        if(JSON.stringify(this.atoms) != JSON.stringify(state.get_atoms())) { return false; }  // TODO: Array comparison could be done more efficiently
        if(this.mode == State_Mode.Counterfactual && this.delim_world != state.get_delim_world().index) { return false; }
        return true;
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

    get_graph(): Graph {
        return cloneDeep(this.similarity_graph);
    }

    get_active_player(): Player {
        return this.active_player;
    }

    get_atoms(): string[] {
        return cloneDeep(this.atoms);
    }

    get_delim_world(): World {
        if(this.mode != State_Mode.Counterfactual) { throw new Error("Game_State has no property delim_world in the current mode"); }
        return this.similarity_graph.get_world(this.delim_world);
    }

    get_radius(): number {
        if(this.mode != State_Mode.Counterfactual) { throw new Error("Game_State has no property radius in the current mode"); }
        return this.r;
    }

    to_string(): string {   // Doesnt incorporate Graph information
        return "("+State_Mode[this.mode]+", "+this.supposition.to_string()+", "+this.current_world+", "+Player[this.active_player]+", "+this.delim_world+")";
    }
}
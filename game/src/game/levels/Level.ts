import { cloneDeep } from "lodash";
import { Graph } from "../../util/Graph";
import { Game_State } from "../Game_State";

export class Level {

    static create(name: string, state_mode: string, supposition: string, atoms: string[], turn: string, current_world: integer, delim_world: integer,
        worlds: string[][], world_positions: [number, number][], edges: [number, number, number][]): Level_State {
        return {
            name: name,
            state_mode: state_mode,
            supposition: supposition,
            atoms: cloneDeep(atoms),
            player_turn: turn,
            current_world: current_world,
            delim_world: delim_world,
            graph: {
                worlds: cloneDeep(worlds),
                world_positions: cloneDeep(world_positions),
                edges: cloneDeep(edges)
            }
        }
    }

    static to_state(level: Level_State): Game_State {
        let G = new Graph(level.graph.worlds, level.graph.edges);
        let mode = level.state_mode;
        let supposition = level.supposition;
        let atoms = level.atoms;
        let turn = level.player_turn;
        let current = level.current_world;
        let delim = level.delim_world;

        return Game_State.create(mode, G, supposition, atoms, current, turn, delim);
    }
}

export interface Level_State {
    name: string;
    state_mode: string;
    supposition: string;
    atoms: string[];
    player_turn: string;
    current_world: integer;
    delim_world: integer;
    graph: Graph_State;
}

export interface Graph_State {
    worlds: string[][];
    world_positions: [number, number][];
    edges: [number, number, number][];
}
import { Graph, World } from "./Graph"
import { Formula, Cf_Would, Disjunction, Negation, Atom, Bottom, Any } from "./Cf_Logic";
import {cloneDeep} from 'lodash';

export class Game_State {
    private similarity_graph: Graph;
    private supposition: Formula;
    private current_world: integer;
    private active_player: Player;

    constructor(graph: Graph, supposition: Formula, current_world: integer, active_player: Player) {
        this.similarity_graph = graph;
        this.active_player = active_player;
        this.supposition = supposition;
        this.current_world = current_world;
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

export class Vac_Game_State extends Game_State {

    constructor(graph: Graph, supposition: Formula, current_world: integer, active_player: Player) {
        super(graph, supposition, current_world, active_player);
    }

}

export class Sphere_Game_State extends Game_State {
    private delim_world: integer; // sphere delimiting phi-world
    private r: number;

    constructor(graph: Graph, supposition: Formula, current_world: integer, delim_world: integer, active_player: Player) {
        super(graph, supposition, current_world, active_player);
        this.delim_world = delim_world;
        this.r = 0; // TODO: Get distance from current_world to delim_world
    }
}

export class Rules_Controller {

    static find_transition(state: Game_State): Rules {
        let formula = state.get_formula();
        let world = state.get_current_world();
        switch(true) {
            case formula instanceof Bottom:
                return Rules.Attacker_Victory;
            case formula instanceof Atom:
                return world.is_atom_known_true((formula as Atom).value) ? Rules.Known_Fact : Rules.Unknown_Fact; 
            case formula instanceof Negation:
                break;
            case formula instanceof Disjunction:
                break;
            case formula instanceof Cf_Would:
                break;
            default:
                return Rules.No_Transition;
        }
        return Rules.No_Transition; // TODO: Remove when all cases covered
    }

}

enum Rules {

    /*
    ###BOTTOM###
    Attacker_Victory, (4)

    ###ATOM###
    Unknown_Fact, (7)

    ###NEGATION###
    Defender_Victory, (5)
    Negated_Known_Fact, (8)
    Negated_Unknown_Fact, (9)
    Double_Neation, (10)
    Negated_Left_OR, (13)
    Negated_Right_OR, (14)
    Negated_Counterfactual, (20)
    Disproving_Sphere_Selection, (22)

    ###DISJUNCTION###
    Left_OR, (11)
    Right_OR, (12)

    ###CF_WOULD###
    Counterfactual, (15)
    Proving_Sphere_Selection, (17)

    ####FORMULA###
    Known_Fact, (6)
    */

    Attacker_Victory,
    Defender_Victory,
    Known_Fact,
    Negated_Known_Fact,
    Unknown_Fact,
    Negated_Unknown_Fact,

    Double_Negation,
    Left_OR,
    Right_OR,
    Negated_Left_OR,
    Negated_Right_OR,

    Counterfactual,
    Vacuous_Truth,
    Proving_Sphere_Selection,
    Antedecent_False_At_Phi,
    Disproving_World_Choice,

    Negated_Counterfactual,
    Vacuous_Falsity,
    Disproving_Sphere_Selection,
    Antedecent_True_At_Phi,
    Proving_World_Choice,

    No_Transition
}

enum Player {
    Attacker,
    Defender,
    Either
}
import {cloneDeep} from 'lodash';
import { Formula, Cf_Would, Disjunction, Negation, Atom, Bottom, Any, Conjunction } from "./Cf_Logic";
import { Player, State_Mode, Game_Turn_Type, Player_Abbreviations, State_Mode_Abbreviations, toggle_player } from "../util/Game_Utils"
import { Game_State } from "./Game_State"

export class Rules_Controller {

    private rules: Rule[] = [];

    constructor() {
        this.initialize_rules();
    }

    private initialize_rules() {
        let is_fact_known = (state: Game_State) => state.get_current_world().is_atom_known_true((state.get_formula() as Atom).value);
        let is_fact_unknown = (state: Game_State) => !state.get_current_world().is_atom_known_true((state.get_formula() as Atom).value);
        let is_negated_fact_known = (state: Game_State) => state.get_current_world().is_atom_known_true((state.get_formula().get_child("l") as Atom).value);
        let is_negated_fact_unknown = (state: Game_State) => !state.get_current_world().is_atom_known_true((state.get_formula().get_child("l") as Atom).value);
        let is_no_world_reachable = (state: Game_State) => (state.get_current_world().get_edge_count() == 0);
        let is_another_world_reachable = (state: Game_State) => (state.get_current_world().get_edge_count() > 0); // doesn't exclude itself i.e. reflexive edges
        let is_another_world_reachable_within_delim = (state: Game_State) => (state.get_current_world().get_edge_count() > 0 && state.get_current_world().get_edge_list().some((value) => value[2] <= state.get_radius()));
        let is_another_world_reachable_within_strict_delim = (state: Game_State) => (state.get_current_world().get_edge_count() > 0 && state.get_current_world().get_edge_list().some((value) => value[2] < state.get_radius()));

        this.rules.push(Rule.create("Attacker_Victory", "Vic", "a", "?"));
        this.rules.push(Rule.create("Defender_Victory", "Vic", "d", "?"));

        let apply_attacker_landing = (state: Game_State) => state.configure("Vic", Formula.parse("¯|¯"), "a");
        this.rules.push(Rule.create("Attacker_Landing", "Res", "a", "¯|¯", apply_attacker_landing));

        let apply_defender_landing = (state: Game_State) => state.configure("Vic", Formula.parse("¯|¯"), "d");
        this.rules.push(Rule.create("Defender_Landing", "Res", "d", "¯|¯", apply_defender_landing));

        let apply_attacker_stranding = (state: Game_State) => state.configure("Vic", Formula.parse("_|_"), "d");
        this.rules.push(Rule.create("Attacker_Stranding", "Res", "a", "_|_", apply_attacker_stranding));

        let apply_defender_stranding = (state: Game_State) => state.configure("Vic", Formula.parse("_|_"), "a");
        this.rules.push(Rule.create("Defender_Stranding", "Res", "d", "_|_", apply_defender_stranding));


        let apply_attacker_known_fact = (state: Game_State) => state.configure("Res", Formula.parse("¯|¯"), "a");
        this.rules.push(Rule.create("Attacker_Known_Fact", "Res", "a", "A", apply_attacker_known_fact, is_fact_known));

        let apply_defender_known_fact = (state: Game_State) => state.configure("Res", Formula.parse("¯|¯"), "d");
        this.rules.push(Rule.create("Defender_Known_Fact", "Res", "d", "A", apply_defender_known_fact, is_fact_known));

        let apply_attacker_unknown_fact = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a");
        this.rules.push(Rule.create("Attacker_Unknown_Fact", "Res", "a", "A", apply_attacker_unknown_fact, is_fact_unknown));

        let apply_defender_unknown_fact = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "d");
        this.rules.push(Rule.create("Defender_Unknown_Fact", "Res", "d", "A", apply_defender_unknown_fact, is_fact_unknown));


        let apply_attacker_negation = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "d");
        this.rules.push(Rule.create("Attacker_Negation", "Res", "a", "~?", apply_attacker_negation));

        let apply_defender_negation = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "a");
        this.rules.push(Rule.create("Defender_Negation", "Res", "d", "~?", apply_defender_negation));

    
        let apply_attacker_left_or = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "a");
        this.rules.push(Rule.create("Attacker_Left_OR", "Res", "a", "?v?", apply_attacker_left_or));
        
        let apply_attacker_right_or = (state: Game_State) => state.configure("Res", state.get_formula().get_child("r"), "a");
        this.rules.push(Rule.create("Attacker_Right_OR", "Res", "a", "?v?", apply_attacker_right_or));

        let apply_defender_left_or = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "d");
        this.rules.push(Rule.create("Defender_Left_OR", "Res", "d", "?v?", apply_defender_left_or));

        let apply_defender_right_or = (state: Game_State) => state.configure("Res", state.get_formula().get_child("r"), "d");
        this.rules.push(Rule.create("Defender_Right_OR", "Res", "d", "?v?", apply_defender_right_or));



        let apply_attacker_left_and = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "a");
        this.rules.push(Rule.create("Attacker_Left_AND", "Res", "a", "?^?", apply_attacker_left_and).set_inverted(true));
        
        let apply_attacker_right_and = (state: Game_State) => state.configure("Res", state.get_formula().get_child("r"), "a");
        this.rules.push(Rule.create("Attacker_Right_AND", "Res", "a", "?^?", apply_attacker_right_and).set_inverted(true));

        let apply_defender_left_and = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "d");
        this.rules.push(Rule.create("Defender_Left_AND", "Res", "d", "?^?", apply_defender_left_and).set_inverted(true));
        
        let apply_defender_right_and = (state: Game_State) => state.configure("Res", state.get_formula().get_child("r"), "d");
        this.rules.push(Rule.create("Defender_Right_AND", "Res", "d", "?^?", apply_defender_right_and).set_inverted(true));

        // Modal Operators

        let apply_attacker_possibility = (state: Game_State, delim_world?: integer) => state.configure("Res", state.get_formula().get_child("l"), "a", delim_world);
        this.rules.push(Rule.create("Attacker_Possibility", "Res", "a", "<>?", apply_attacker_possibility, is_another_world_reachable, true));
        // Vacuous Possibility: In case no world is reachable possibility is vacuously false.
        let apply_attacker_vacuous_possibility = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a");
        this.rules.push(Rule.create("Attacker_Vacuous_Possibility", "Res", "a", "<>?", apply_attacker_vacuous_possibility, is_no_world_reachable));

        let apply_defender_possibility = (state: Game_State, delim_world?: integer) => state.configure("Res", state.get_formula().get_child("l"), "d", delim_world);
        this.rules.push(Rule.create("Defender_Possibility", "Res", "d", "<>?", apply_defender_possibility, is_another_world_reachable, true));
        // Vacuous Possibility: In case no world is reachable possibility is vacuously false.
        let apply_defender_vacuous_possibility = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "d");
        this.rules.push(Rule.create("Defender_Vacuous_Possibility", "Res", "d", "<>?", apply_defender_vacuous_possibility, is_no_world_reachable));

        let apply_attacker_necessity = (state: Game_State, delim_world?: integer) => state.configure("Res", state.get_formula().get_child("l"), "a", delim_world);
        this.rules.push(Rule.create("Attacker_Necessity", "Res", "a", "[_]?", apply_attacker_necessity, is_another_world_reachable, true).set_inverted(true));
        // TODO: Vacuous Necessity? In our case we always have reflexive edges and thus a reachable world. In case no world is reachable possibility is vacuously false.
        let apply_attacker_vacuous_necessity = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a");
        this.rules.push(Rule.create("Attacker_Vacuous_Necessity", "Res", "a", "[_]?", apply_attacker_vacuous_necessity, is_no_world_reachable).set_inverted(true));

        let apply_defender_necessity = (state: Game_State, delim_world?: integer) => state.configure("Res", state.get_formula().get_child("l"), "d", delim_world);
        this.rules.push(Rule.create("Defender_Necessity", "Res", "d", "[_]?", apply_defender_necessity, is_another_world_reachable, true).set_inverted(true));
        // TODO: Vacuous Necessity? In our case we always have reflexive edges and thus a reachable world. In case no world is reachable possibility is vacuously false.
        let apply_defender_vacuous_necessity = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "d");
        this.rules.push(Rule.create("Defender_Vacuous_Necessity", "Res", "d", "[_]?", apply_defender_vacuous_necessity, is_no_world_reachable).set_inverted(true));

        // Counterfactual Would Rules

        let apply_attacker_might_sphere_selection = (state: Game_State, delim_world?: integer) => state.configure("Cf", state.get_formula(), "d", undefined, delim_world);
        this.rules.push(Rule.create("Attacker_Might_Sphere_Selection", "Res", "a", "? ⩽⩾-> ?", apply_attacker_might_sphere_selection, is_another_world_reachable, true));

        let apply_attacker_vacuous_might_sphere_selection = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a", undefined);
        this.rules.push(Rule.create("Attacker_Vacuous_Might_Sphere_Selection", "Res", "a", "? ⩽⩾-> ?", apply_attacker_vacuous_might_sphere_selection, is_no_world_reachable));

        let apply_defender_might_target_evaluation = (state: Game_State) => state.configure("Res", new Conjunction(state.get_formula().get_child("l"), state.get_formula().get_child("r")), "a", state.get_delim_world().index, Infinity);
        this.rules.push(Rule.create("Defender_Might_Target_Evaluation", "Cf", "d", "? ⩽⩾-> ?", apply_defender_might_target_evaluation));

        let apply_defender_might_closer_phi_world = (state: Game_State, delim_world?: integer) => state.configure("Res", new Negation(state.get_formula().get_child("l")), "a", delim_world, Infinity);
        this.rules.push(Rule.create("Defender_Might_Closer_Phi_World", "Cf", "d", "? ⩽⩾-> ?", apply_defender_might_closer_phi_world, is_another_world_reachable_within_strict_delim, true));

        let apply_defender_might_sphere_selection = (state: Game_State, delim_world?: integer) => state.configure("Cf", state.get_formula(), "a", undefined, delim_world);
        this.rules.push(Rule.create("Defender_Might_Sphere_Selection", "Res", "d", "? ⩽⩾-> ?", apply_defender_might_sphere_selection, is_another_world_reachable, true));

        let apply_defender_vacuous_might_sphere_selection = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "d", undefined);
        this.rules.push(Rule.create("Defender_Vacuous_Might_Sphere_Selection", "Res", "d", "? ⩽⩾-> ?", apply_defender_vacuous_might_sphere_selection, is_no_world_reachable));

        let apply_attacker_might_target_evaluation = (state: Game_State) => state.configure("Res", new Conjunction(state.get_formula().get_child("l"), state.get_formula().get_child("r")), "d", state.get_delim_world().index, Infinity);
        this.rules.push(Rule.create("Attacker_Might_Target_Evaluation", "Cf", "a", "? ⩽⩾-> ?", apply_attacker_might_target_evaluation));

        let apply_attacker_might_closer_phi_world = (state: Game_State, delim_world?: integer) => state.configure("Res", new Negation(state.get_formula().get_child("l")), "d", delim_world, Infinity);
        this.rules.push(Rule.create("Attacker_Might_Closer_Phi_World", "Cf", "a", "? ⩽⩾-> ?", apply_attacker_might_closer_phi_world, is_another_world_reachable_within_strict_delim, true));

        /* let apply_defender_sphere_selection = (state: Game_State, delim_world?: integer) => state.configure("Cf", state.get_formula(), "a", undefined, delim_world);
        this.rules.push(Rule.create("Defender_Sphere_Selection", "Res", "d", "? ⩽⩾-> ?", apply_defender_sphere_selection, is_another_world_reachable, true));

        let apply_defender_vacuous_sphere_selection = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "d", undefined);
        this.rules.push(Rule.create("Defender_Vacuous_Sphere_Selection", "Res", "d", "? ⩽⩾-> ?", apply_defender_vacuous_sphere_selection, is_no_world_reachable));

        let apply_attacker_target_evaluation = (state: Game_State) => state.configure("Res", new Conjunction(state.get_formula().get_child("l"), state.get_formula().get_child("r")), "d", state.get_delim_world().index, Infinity);
        this.rules.push(Rule.create("Attacker_Target_Evaluation", "Cf", "a", "? ⩽⩾-> ?", apply_attacker_target_evaluation));

        let apply_attacker_closer_phi_world = (state: Game_State, delim_world?: integer) => state.configure("Res", state.get_formula().get_child("l"), "a", delim_world, Infinity);
        this.rules.push(Rule.create("Attacker_Closer_Phi_World", "Cf", "a", "? ⩽⩾-> ?", apply_attacker_closer_phi_world, is_another_world_reachable_within_strict_delim, true));

        let apply_attacker_sphere_selection = (state: Game_State, delim_world?: integer) => state.configure("Cf", state.get_formula(), "d", undefined, delim_world);
        this.rules.push(Rule.create("Attacker_Sphere_Selection", "Res", "a", "? ⩽⩾-> ?", apply_attacker_sphere_selection, is_another_world_reachable, true));

        let apply_attacker_vacuous_sphere_selection = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a", undefined);
        this.rules.push(Rule.create("Attacker_Vacuous_Sphere_Selection", "Res", "a", "? ⩽⩾-> ?", apply_attacker_vacuous_sphere_selection, is_no_world_reachable));

        let apply_defender_target_evaluation = (state: Game_State) => state.configure("Res", new Conjunction(state.get_formula().get_child("l"), state.get_formula().get_child("r")), "a", state.get_delim_world().index, Infinity);
        this.rules.push(Rule.create("Defender_Target_Evaluation", "Cf", "d", "? ⩽⩾-> ?", apply_defender_target_evaluation));

        let apply_defender_closer_phi_world = (state: Game_State, delim_world?: integer) => state.configure("Res", state.get_formula().get_child("l"), "d", delim_world, Infinity);
        this.rules.push(Rule.create("Defender_Closer_Phi_World", "Cf", "d", "? ⩽⩾-> ?", apply_defender_closer_phi_world, is_another_world_reachable_within_strict_delim, true));
 */
    }

    /**
     * Retrieve all applicable rules
     * @param state Current Game_State
     * @returns A list of all applicable rules
     */
    applicable(state: Game_State): Rule[] {
        let applicable: Rule[] = [];

        for(let i=0; i<this.rules.length; i++) {
            let R = this.rules[i];
            if(R.is_applicable(state)) {
                applicable.push(cloneDeep(R));
            }
        }
        return applicable;
    }

    /**
     * Retrieve the defenders possible moves in the passed Game_State
     * @param state Current Game_State
     * @returns A list of rules applicable by the defender
     */
    defender_moves(state: Game_State): Rule[] {
        return this.applicable(state).filter((rule: Rule) => rule.get_acting_player() == Player.Defender || rule.get_acting_player() == Player.Either);
    }

    /**
     * Retrieve the attackers possible moves in the passed Game_State
     * @param state Current Game_State
     * @returns A list of rules applicable by the attacker
     */
     attacker_moves(state: Game_State): Rule[] {
        return this.applicable(state).filter((rule: Rule) => rule.get_acting_player() == Player.Attacker || rule.get_acting_player() == Player.Either);
    }

    /**
     * Calculate all possible next game states
     * @param state State to determine successorstates to
     * @param moves An explicit selection of moves to be applicable
     * @returns A list of successor game states
     */
    next_game_states(state: Game_State, moves?: Rule[]): Game_State[] {
        moves = moves ?? this.defender_moves(state);
        moves = (moves == undefined || moves.length == 0) ? this.attacker_moves(state) : moves;

        let successorstates: Game_State[] = [];
        let move;
        let next;
        for(let i=0; i<moves.length; i++) {
            move = moves[i];

            if(move.get_world_input_requirement()) {
                let g = state.get_graph();
                let worlds = g.get_V();
                for(let j=0; j<worlds; j++) {
                    let possible = false;
                    switch(true) {
                        case move.get_name() == Rules.Attacker_Possibility:
                        case move.get_name() == Rules.Defender_Possibility:
                        case move.get_name() == Rules.Attacker_Necessity:
                        case move.get_name() == Rules.Defender_Necessity:
                        case move.get_name() == Rules.Defender_Might_Sphere_Selection:
                        case move.get_name() == Rules.Attacker_Might_Sphere_Selection:
                            possible = state.get_current_world().is_adj(j);
                            break;
                        case move.get_name() == Rules.Attacker_Might_Closer_Phi_World:
                        case move.get_name() == Rules.Defender_Might_Closer_Phi_World:
                            possible = state.get_current_world().is_adj(j) && state.get_current_world().get_edge(j)[1] < state.get_radius();
                            break;
                        default:
                            break
                    }
                    if(possible) {
                        next = move.apply(cloneDeep(state), j);
                        successorstates.push(next);
                    }
                }
            } else {
                next = move.apply(cloneDeep(state));
                successorstates.push(next);
            }
        }
        return successorstates;
    }

    get_rule(name: Rules): Rule {
        return cloneDeep(this.rules.find((value) => value.get_name() == name))!;
    }
}

export class Rule {
    private name: Rules;

    // Preconditions
    private state_mode: State_Mode;
    private active_player: Player;
    private structure: Formula;
    private special: (state: Game_State) => boolean;

    // Postconditions
    readonly apply: (state: Game_State, delim_world?: integer) => Game_State;

    private requires_world_input: boolean = false;

    // Other
    private inverted = false;

    constructor(name: Rules, mode: State_Mode, active_player: Player, structure: Formula, apply?: (state: Game_State, delim_world?: integer) => Game_State, special_condition?: (state: Game_State) => boolean, requires_world_input?: boolean) {
        this.name = name;
        this.state_mode = mode;
        this.active_player = active_player;
        this.structure = structure;
        this.special = special_condition ?? (() => true);
        this.apply = apply ?? ((state: Game_State) => state);
        this.requires_world_input = requires_world_input ?? this.requires_world_input;
    }

    /**
     * Create an instance of the Rule class by passing abbreviated values
     * @param name A string representation of a value of the Rules enum type
     * @param mode A string abbreviation of a value of the State_Mode enum type ("Res", "Cf", "Vac")
     * @param player A string abbreviation of a value of the Player enum type ("a", "d", "a/d")
     * @param formula A string representation of the atructure of any formula this rule is applicable to
     * @param apply A function describing the transformation in the game state through the application of this rule
     * @param special A function evaluating extraneous preconditions for this rules application
     * @returns A freshly created Rule instance
     */
    static create(name: string, mode: string, player: string, formula: string, apply?: (state: Game_State, delim_world?: integer) => Game_State, special?: (state: Game_State) => boolean, requires_world_input?: boolean): Rule {
        let rule_name: Rules = (<any>Rules)[name];
        let state_mode: State_Mode | undefined = State_Mode_Abbreviations.get(mode);
        let active_player: Player | undefined = Player_Abbreviations.get(player);

        if(rule_name == undefined || state_mode == undefined || active_player == undefined) {
            throw new Error("Passed incorrect rule name or precondition abbreviation");
        }

        return new Rule(rule_name, state_mode, active_player, Formula.parse(formula), apply, special, requires_world_input);
    }

    get_name(): Rules {
        return this.name;
    }

    get_player(): Player {
        return this.active_player;
    }

    get_acting_player(): Player {
        return (this.inverted) ? toggle_player(this.active_player) : this.active_player;
    }

    get_world_input_requirement(): boolean {
        return this.requires_world_input;
    }

    get_special_condition(): (state: Game_State) => boolean {
        return this.special;
    }

    is_applicable(state: Game_State): boolean {

        if(state.get_mode() != this.state_mode) { return false; }
        if(state.get_active_player() != Player.Either && state.get_active_player() != this.active_player) { return false; }
        if(!this.structure.compare(state.get_formula())) { return false; }
        if(!this.special(state)) { return false; }

        return true;
    }

    set_inverted(inverted: boolean): Rule {
        this.inverted = inverted;
        return this;
    }
}

export enum Rules {

    Attacker_Victory,
    Defender_Victory,
    /* Attacker_Defeat,
    Defender_Defeat, */
    Attacker_Landing,
    Defender_Landing,
    Attacker_Stranding,
    Defender_Stranding,

    Attacker_Known_Fact,
    Defender_Known_Fact,
    Attacker_Unknown_Fact,
    Defender_Unknown_Fact,

    Attacker_Negation,
    Defender_Negation,

    Attacker_Left_OR,
    Attacker_Right_OR,
    Defender_Left_OR,
    Defender_Right_OR,
    Attacker_Left_AND,
    Attacker_Right_AND,
    Defender_Left_AND,
    Defender_Right_AND,

    Attacker_Possibility,
    Attacker_Vacuous_Possibility,
    Defender_Possibility,
    Defender_Vacuous_Possibility,
    Attacker_Necessity,
    Attacker_Vacuous_Necessity,
    Defender_Necessity,
    Defender_Vacuous_Necessity,

    Attacker_Might_Sphere_Selection,
    Attacker_Vacuous_Might_Sphere_Selection,
    Defender_Might_Target_Evaluation,
    Defender_Might_Closer_Phi_World,
    Defender_Might_Sphere_Selection,
    Defender_Vacuous_Might_Sphere_Selection,
    Attacker_Might_Target_Evaluation,
    Attacker_Might_Closer_Phi_World,




    /* Attacker_Sphere_Selection,
    Attacker_Vacuous_Sphere_Selection,
    Defender_Target_Evaluation,
    Defender_Closer_Phi_World, */

    /* Defender_Sphere_Selection,
    Defender_Vacuous_Sphere_Selection,
    Attacker_Target_Evaluation,
    Attacker_Closer_Phi_World,
    Attacker_Sphere_Selection,
    Attacker_Vacuous_Sphere_Selection,
    Defender_Target_Evaluation,
    Defender_Closer_Phi_World, */


    No_Transition
}
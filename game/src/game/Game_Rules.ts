import {cloneDeep} from 'lodash';
import { Formula, Cf_Would, Disjunction, Negation, Atom, Bottom, Any } from "./Cf_Logic";
import { Player, State_Mode, Game_Turn_Type, Player_Abbreviations, State_Mode_Abbreviations } from "../util/Game_Utils"
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
        let is_another_world_reachable = (state: Game_State) => (state.get_current_world().get_edge_count() > 0);
        let is_another_world_reachable_within_delim = (state: Game_State) => (state.get_current_world().get_edge_count() > 0 && state.get_current_world().get_edge_list().some((value) => value[1] <= state.get_radius()));

        this.rules.push(Rule.create("Attacker_Victory", "Res", "a", "_|_"));
        this.rules.push(Rule.create("Defender_Victory", "Res", "a", "¯|¯"));

        let apply_negated_bottom = (state: Game_State) => state.configure("Res", Formula.parse("¯|¯"), "a/d");
        this.rules.push(Rule.create("Negated_Bottom", "Res", "a", "~_|_", apply_negated_bottom));

        let apply_negated_top = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a/d");
        this.rules.push(Rule.create("Negated_Top", "Res", "a", "~¯|¯", apply_negated_top));

        let apply_known_fact = (state: Game_State) => state.configure("Res", Formula.parse("¯|¯"), "a/d");
        this.rules.push(Rule.create("Known_Fact", "Res", "a", "A", apply_known_fact, is_fact_known));

        let apply_unknown_fact = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a/d");
        this.rules.push(Rule.create("Unknown_Fact", "Res", "a", "A", apply_unknown_fact, is_fact_unknown));

        let apply_negated_known_fact = (state: Game_State) => state.configure("Res", Formula.parse("~¯|¯"), "a/d");
        this.rules.push(Rule.create("Negated_Known_Fact", "Res", "a", "~A", apply_negated_known_fact, is_negated_fact_known));

        let apply_negated_unknown_fact = (state: Game_State) => state.configure("Res", Formula.parse("~_|_"), "a/d");
        this.rules.push(Rule.create("Negated_Unknown_Fact", "Res", "a", "~A", apply_negated_unknown_fact, is_negated_fact_unknown));
        
        let apply_double_negation = (state: Game_State) => state.configure("Res", state.get_formula().get_child("ll"), "a/d");
        this.rules.push(Rule.create("Double_Negation", "Res", "a", "~~?", apply_double_negation));

        let apply_left_or = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "a/d");
        this.rules.push(Rule.create("Left_OR", "Res", "d", "?v?", apply_left_or));

        let apply_right_or = (state: Game_State) => state.configure("Res", state.get_formula().get_child("r"), "a/d");
        this.rules.push(Rule.create("Right_OR", "Res", "d", "?v?", apply_right_or));

        let apply_negated_left_or = (state: Game_State) => state.configure("Res", new Negation(state.get_formula().get_child("ll")), "a/d");
        this.rules.push(Rule.create("Negated_Left_OR", "Res", "a", "~(?v?)", apply_negated_left_or));

        let apply_negated_right_or = (state: Game_State) => state.configure("Res", new Negation(state.get_formula().get_child("lr")), "a/d");
        this.rules.push(Rule.create("Negated_Right_OR", "Res", "a", "~(?v?)", apply_negated_right_or));

        let apply_left_and = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "a/d");
        this.rules.push(Rule.create("Left_AND", "Res", "a", "?^?", apply_left_and));

        let apply_right_and = (state: Game_State) => state.configure("Res", state.get_formula().get_child("r"), "a/d");
        this.rules.push(Rule.create("Right_AND", "Res", "a", "?^?", apply_right_and));

        let apply_negated_left_and = (state: Game_State) => state.configure("Res", new Negation(state.get_formula().get_child("ll")), "a/d");
        this.rules.push(Rule.create("Negated_Left_AND", "Res", "d", "~(?^?)", apply_negated_left_and));

        let apply_negated_right_and = (state: Game_State) => state.configure("Res", new Negation(state.get_formula().get_child("lr")), "a/d");
        this.rules.push(Rule.create("Negated_Right_AND", "Res", "d", "~(?^?)", apply_negated_right_and));

        // Counterfactual Would Rules
        let apply_sphere_selection = (state: Game_State, delim_world?: integer) => state.configure("Cf", state.get_formula(), "a", undefined, delim_world);
        this.rules.push(Rule.create("Defender_Sphere_Selection", "Res", "d", "? |_|-> ?", apply_sphere_selection, is_another_world_reachable, true));
        /* let apply_counterfactual = (state: Game_State, delim_world?: integer) => ((delim_world == -1) ? state.configure("Vac", state.get_formula().get_child("l"), "a") : state.configure("Cf", state.get_formula(), "a", undefined, delim_world));
        this.rules.push(Rule.create("Defender_Counterfactual", "Res", "d", "? |_|-> ?", apply_counterfactual, is_another_world_reachable, true)); */

        let apply_attacker_phi_eval = (state: Game_State) => state.configure("Res", state.get_formula().get_child("l"), "a/d", state.get_delim_world().index, -1);
        this.rules.push(Rule.create("Attacker_Phi_Evaluation", "Cf", "a", "? |_|-> ?", apply_attacker_phi_eval));

        let apply_attacker_world_choice = (state: Game_State, delim_world?: integer) => state.configure("Res", new Disjunction(new Negation(state.get_formula().get_child("l")), state.get_formula().get_child("r")), "d", delim_world, -1);
        this.rules.push(Rule.create("Attacker_World_Choice", "Cf", "a", "? |_|-> ?", apply_attacker_world_choice, is_another_world_reachable_within_delim, true));

        let apply_vacuous_truth_claim = (state: Game_State) => state.configure("Vac", state.get_formula().get_child("l"), "a");
        this.rules.push(Rule.create("Defender_Vacuous_Truth_Claim", "Res", "d", "? |_|-> ?", apply_vacuous_truth_claim));

        let apply_attacker_vac_world_choice = (state: Game_State, delim_world?: integer) => state.configure("Res", new Negation(state.get_formula()), "a/d", delim_world);
        this.rules.push(Rule.create("Attacker_Vacuous_World_Choice", "Vac", "a", "?", apply_attacker_vac_world_choice, is_another_world_reachable, true));

        let apply_attacker_sphere_selection = (state: Game_State, delim_world?: integer) => state.configure("Cf", state.get_formula(), "d", undefined, delim_world);
        this.rules.push(Rule.create("Attacker_Sphere_Selection", "Res", "a", "~(? |_|-> ?)", apply_attacker_sphere_selection, is_another_world_reachable, true));

        let apply_defender_phi_eval = (state: Game_State) => state.configure("Res", new Negation(state.get_formula().get_child("ll")), "a/d", state.get_delim_world().index, -1);
        this.rules.push(Rule.create("Defender_Phi_Evaluation", "Cf", "d", "~(? |_|-> ?)", apply_defender_phi_eval));

        let apply_defender_world_choice = (state: Game_State, delim_world?: integer) => state.configure("Res", new Negation(new Disjunction(new Negation(state.get_formula().get_child("ll")), state.get_formula().get_child("lr"))), "a", delim_world, -1);
        this.rules.push(Rule.create("Defender_World_Choice", "Cf", "d", "~(? |_|-> ?)", apply_defender_world_choice, is_another_world_reachable_within_delim, true));

        let apply_attacker_vacuous_truth_claim = (state: Game_State) => state.configure("Vac", state.get_formula().get_child("ll"), "d");
        this.rules.push(Rule.create("Attacker_Vacuous_Truth_Claim", "Res", "a", "~(? |_|-> ?)", apply_attacker_vacuous_truth_claim));

        let apply_defender_vac_world_choice = (state: Game_State, delim_world?: integer) => state.configure("Res", state.get_formula(), "a/d", delim_world);
        this.rules.push(Rule.create("Defender_Vacuous_World_Choice", "Vac", "d", "?", apply_defender_vac_world_choice, is_another_world_reachable, true));
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
        return this.applicable(state).filter((rule: Rule) => rule.get_player() == Player.Defender || rule.get_player() == Player.Either);
    }

    /**
     * Retrieve the attackers possible moves in the passed Game_State
     * @param state Current Game_State
     * @returns A list of rules applicable by the attacker
     */
     attacker_moves(state: Game_State): Rule[] {
        return this.applicable(state).filter((rule: Rule) => rule.get_player() == Player.Attacker || rule.get_player() == Player.Either);
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
                        case move.get_name() == Rules.Defender_Sphere_Selection:
                        case move.get_name() == Rules.Attacker_Sphere_Selection:
                        case move.get_name() == Rules.Defender_Vacuous_World_Choice:
                        case move.get_name() == Rules.Attacker_Vacuous_World_Choice:
                            possible = state.get_current_world().is_adj(j);
                            break;
                        case move.get_name() == Rules.Defender_World_Choice:
                        case move.get_name() == Rules.Attacker_World_Choice:
                            possible = state.get_current_world().is_adj(j) && state.get_current_world().get_edge(j)[1] <= state.get_radius();
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
}

export enum Rules {

    Attacker_Victory,
    Defender_Victory,
    Negated_Bottom,
    Negated_Top,
    Known_Fact,
    Unknown_Fact,
    Negated_Known_Fact,
    Negated_Unknown_Fact,

    Double_Negation,
    Left_OR,
    Right_OR,
    Negated_Left_OR,
    Negated_Right_OR,
    Left_AND,
    Right_AND,
    Negated_Left_AND,
    Negated_Right_AND,

    //Defender_Counterfactual,
    Defender_Sphere_Selection,
    Attacker_Phi_Evaluation,
    Attacker_World_Choice,
    Defender_Vacuous_Truth_Claim,
    Attacker_Vacuous_World_Choice,

    Attacker_Sphere_Selection,
    Defender_Phi_Evaluation,
    Defender_World_Choice,
    Attacker_Vacuous_Truth_Claim,
    Defender_Vacuous_World_Choice,

    No_Transition
}
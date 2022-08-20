import {cloneDeep} from 'lodash';
import { Formula, Cf_Would, Disjunction, Negation, Atom, Bottom, Any } from "../util/Cf_Logic";
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

        this.rules.push(Rule.create("Attacker_Victory", "Res", "a", "_|_"));
        this.rules.push(Rule.create("Defender_Victory", "Res", "a", "~_|_"));

        let apply_known_fact = (state: Game_State) => state.configure("Res", Formula.parse("~_|_"), "a/d");
        this.rules.push(Rule.create("Known_Fact", "Res", "a", "A", apply_known_fact, is_fact_known));

        let apply_unknown_fact = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a/d");
        this.rules.push(Rule.create("Unknown_Fact", "Res", "a", "A", apply_unknown_fact, is_fact_unknown));

        let apply_negated_known_fact = (state: Game_State) => state.configure("Res", Formula.parse("_|_"), "a/d");
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
        
        // TODO: Add Rules
        //let apply_counterfactual = (state: Game_State) => state.configure("Cf", state.get_formula(), "a", undefined, undefined /* Get User choice of delim_world */);
        //this.rules.push(Rule.create("Counterfactual", "Res", "d", "? |_|-> ?", apply_counterfactual, is_another_world_reachable));
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

}

export class Rule {
    private name: Rules;

    // Preconditions
    private state_mode: State_Mode;
    private active_player: Player;
    private structure: Formula;
    private special: (state: Game_State) => boolean;

    // Postconditions
    readonly apply: (state: Game_State) => Game_State;

    constructor(name: Rules, mode: State_Mode, active_player: Player, structure: Formula, apply?: (state: Game_State) => Game_State, special_condition?: (state: Game_State) => boolean) {
        this.name = name;
        this.state_mode = mode;
        this.active_player = active_player;
        this.structure = structure;
        this.special = special_condition ?? (() => true);
        this.apply = apply ?? ((state: Game_State) => state);
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
    static create(name: string, mode: string, player: string, formula: string, apply?: (state: Game_State) => Game_State, special?: (state: Game_State) => boolean): Rule {
        let rule_name: Rules = (<any>Rules)[name];
        let state_mode: State_Mode | undefined = State_Mode_Abbreviations.get(mode);
        let active_player: Player | undefined = Player_Abbreviations.get(player);

        if(rule_name == undefined || state_mode == undefined || active_player == undefined) {
            throw new Error("Passed incorrect rule name or precondition abbreviation");
        }

        return new Rule(rule_name, state_mode, active_player, Formula.parse(formula), apply, special);
    }

    get_name(): Rules {
        return this.name;
    }

    get_player(): Player {
        return this.active_player;
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

    /*
    ###BOTTOM###
    Attacker_Victory, (4)

    ###ATOM###
    Known_Fact, (6)
    Unknown_Fact, (7)

    ###NEGATION###
    Defender_Victory, (5)
    Negated_Known_Fact, (8)
    Negated_Unknown_Fact, (9)
    Double_Negation, (10)
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
    Formerly: Known_Fact, (6)
    */

    Attacker_Victory,
    Defender_Victory,
    Known_Fact,
    Unknown_Fact,
    Negated_Known_Fact,
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
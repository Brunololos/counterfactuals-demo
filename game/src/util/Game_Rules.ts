import {cloneDeep} from 'lodash';
import { Formula, Cf_Would, Disjunction, Negation, Atom, Bottom, Any } from "./Cf_Logic";
import { Player, State_Mode, Player_Abbreviations, State_Mode_Abbreviations } from "./Game_Utils"
import { Game_State } from "./Game_State"

export class Rules_Controller {

    private rules: Rule[] = [];

    constructor() {
        this.initialize_rules();
    }

    private initialize_rules() {
        let identity = (state: Game_State) => state;
        this.rules.push(Rule.create("Attacker_Victory", "Res", "a", "_|_"));
        this.rules.push(Rule.create("Defender_Victory", "Res", "a", "~_|_"));
        //this.rules.push(new Rule(Rules.Known_Fact, State_Mode.Resolve, Player.Attacker, Formula.parse("?"), (state: Game_State) => state));
    }

    find_transition(state: Game_State): Rule[] {
        let formula = state.get_formula();
        let world = state.get_current_world();

        let applicable: Rule[] = [];

        for(let i=0; i<this.rules.length; i++) {
            let R = this.rules[i];
            if(R.is_applicable(state)) {
                applicable.push(cloneDeep(R));
            }
        }
        return applicable;
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
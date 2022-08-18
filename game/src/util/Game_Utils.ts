export enum Player {
    Attacker,
    Defender,
    Either
}

export enum State_Mode {
    Resolve,         /* Resolve the formula at the current world */
    Vacuous,         /* Evaluate vacuous truth for the current world */
    Counterfactual   /* Evaluate non-vacuous truth throughout the current sphere of accessibility */
}

export enum Game_Turn_Type {
    Resolution,        /* There is only 1 applicable game rule in this turn */
    Attacker_Choice,   /* The attacker has multiple applicable game rules to choose from (and there is no applicable defenders rule) */
    Defender_Choice    /* The defender has multiple applicable game rules to choose from */
}

export let Player_Abbreviations = new Map<string, Player>([
    ["a", Player.Attacker],
    ["d", Player.Defender],
    ["a/d", Player.Either],
    ["d/a", Player.Either]
]);

export let State_Mode_Abbreviations = new Map<string, State_Mode>([
    ["Res", State_Mode.Resolve],
    ["Cf", State_Mode.Counterfactual],
    ["Vac", State_Mode.Vacuous]
]);
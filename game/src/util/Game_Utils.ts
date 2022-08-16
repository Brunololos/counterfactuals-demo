export enum Player {
    Attacker,
    Defender,
    Either
}

export enum State_Mode {
    Resolve,        /* Resolve the formula at the current world */
    Vacuous,        /* Evaluate vacuous truth for the current world */
    Counteractual   /* Evaluate non-vacuous truth throughout the current sphere of accessibility */
}

export let Player_Abbreviations = new Map<string, Player>([
    ["a", Player.Attacker],
    ["d", Player.Defender],
    ["a/d", Player.Either],
    ["d/a", Player.Either]
]);

export let State_Mode_Abbreviations = new Map<string, State_Mode>([
    ["Res", State_Mode.Resolve],
    ["Cf", State_Mode.Counteractual],
    ["Vac", State_Mode.Vacuous]
]);
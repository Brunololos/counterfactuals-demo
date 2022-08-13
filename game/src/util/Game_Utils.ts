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
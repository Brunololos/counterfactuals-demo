export enum Player {
    Attacker,
    Defender,
    Either
}

export enum State_Mode {
    Resolve,         /* Resolve the formula at the current world */
    Vacuous,         /* Evaluate vacuous truth for the current world */
    Counterfactual,  /* Evaluate non-vacuous truth throughout the current sphere of accessibility */
    Victory          /* Game has ended */
}

export enum Game_Turn_Type {
    Defenders_Resolution,        /* The defender has only 1 applicable game rule in this turn */
    Attackers_Resolution,        /* The attacker has only 1 applicable game rule in this turn */
    Defenders_Choice,            /* The defender has multiple applicable game rules to choose from */
    Attackers_Choice,            /* The attacker has multiple applicable game rules to choose from (and there is no applicable defenders rule) */
    Defenders_World_Choice,      /* The defender has to choose a world for a rule */
    No_Moves                     /* No moves are available whatsoever */
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
    ["Vac", State_Mode.Vacuous],
    ["Vic", State_Mode.Victory]
]);

export function toggle_player(player: Player): Player {
    switch(player) {
        case Player.Attacker:
            return Player.Defender;
        case Player.Defender:
            return Player.Attacker;
        case Player.Either:
            return Player.Either;
        default:
            throw new Error("Unknown Player type");
    }
}
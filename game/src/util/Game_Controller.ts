import { Rules_Controller, Rules, Rule } from "./Game_Rules";
import { Game_State } from "./Game_State";

export class Game_Controller {
    private rules_controller: Rules_Controller;
    private state: Game_State;

    constructor(state: Game_State) {
        this.rules_controller = new Rules_Controller();
        this.state = state;
        console.log(this.state.get_formula());
    }

    simulate() {
        let applicable = this.rules_controller.applicable(this.state);

        console.log(this.rules_controller.applicable(this.state).map((value: Rule) => Rules[value.get_name()]));
        
        if(applicable.length == 0) { console.log("No applicable Rule"); return; }

        this.state = applicable[0].apply(this.state);

        console.log(this.state.get_formula());
    }
}
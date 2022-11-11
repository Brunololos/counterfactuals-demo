import { Formula } from "../../game/Cf_Logic";

const ATOMS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export function get_rule_explanations(formula: string, atoms: string[]): [string[], string[][], string[]] {
    let formula_rep: Formula = Formula.parse(formula, atoms);
    let preformulas = ["¯|¯", "_|_"];
    let postformulas = [["¯|¯"], ["_|_"]];
    let explanations = ["The active player wins.", "The active player loses."];

    if(ATOMS.some((value) => formula.includes(value))) {
        preformulas.push("A");
        postformulas.push(["¯|¯", "_|_"]);
        //explanations.push("The active player wins,\nif the current world has an atom\nof the same color and loses otherwise.");
        explanations.push("If the current world has an atom\nof the same color the active player\nwins and loses otherwise.");
    }

    if(formula.includes("~") || formula.includes("⩽⩾->") || formula.includes("|_|->")) {
        preformulas.push("~A");
        postformulas.push(["A"]);
        explanations.push("The active player becomes inactive\nand vice versa.");
    }

    if(formula.includes("v") || formula.includes("|_|->")) {
        preformulas.push("A v B");
        postformulas.push(["A", "B"]);
        explanations.push("The active player chooses left or right.");
    }

    if(formula.includes("^") || formula.includes("⩽⩾->")) {
        preformulas.push("A ^ B");
        postformulas.push(["A", "B"]);
        explanations.push("The inactive player chooses left or right.");
    }

    if(formula.includes("<>")) {
        preformulas.push("<>A");
        postformulas.push(["A"]);
        explanations.push("The active player jumps\nto a reachable world.");
    }
    
    if(formula.includes("[_]")) {
        preformulas.push("[_]A");
        postformulas.push(["A"]);
        explanations.push("The inactive player jumps\nto a reachable world.");
    }

    if(formula.includes("⩽⩾->")) {
        preformulas.push("A ⩽⩾-> B");
        postformulas.push(["A ^ B", "~A"]);
        explanations.push("The active player chooses a reachable world.\nThe inactive player either jumps to that world\nor jumps to a closer world.");
    }

    if(formula.includes("|_|->")) {
        preformulas.push("A |_|-> B");
        postformulas.push(["~A v B", "A"]);
        explanations.push("The inactive player chooses a reachable world.\nThe active player either jumps to that world\nor jumps to a closer world.");
    }

    return [preformulas, postformulas, explanations];
}
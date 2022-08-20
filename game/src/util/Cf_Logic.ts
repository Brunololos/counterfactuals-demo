/**
 * An abstract Superclass to all components of counterfactual logic
 */
export abstract class Formula {

    /**
     * Create an object tree representation of a counterfactual formula
     * @param to_parse A string representation of the formula to be created
     * @param atoms A list of atomic statements contained in the formula
     * @returns The root object of a tree of formula objects
     */
    static parse(to_parse: string, atoms: string[] = []): Formula {
    //Symbols: "|_|->, v, ~, (...), A-Z, _|_, ?"
    //Syntax: "~(A v B) |_|-> (C v ~(D))"

        // search for weakest binder
        let w = 0;
        for(let i=0; i<to_parse.length; i++) {
            let c = to_parse[i];
            let v = to_parse[w];
            switch(true) {
                case to_parse.length >= i+5 && to_parse.slice(i, i+5) == "|_|->":
                    w = (v != '|') ? i : w;
                    break;
                case c == 'v':
                    w = (v != '|' && v != 'v') ? i : w;
                    break;
                case c == '~':
                    w = (v != '|' && v != 'v' && v != '~') ? i : w;
                    break;
                case c == '(':
                    w = (v != '|' && v != 'v' && v != '~' && v != '~') ? i : w;

                    let unclosed_brackets = 1;
                    while(i < to_parse.length && unclosed_brackets > 0) {
                        i++;
                        if(to_parse[i] == '(') { unclosed_brackets++; }
                        if(to_parse[i] == ')') { unclosed_brackets--; }
                    }
                    break;
                case c >= 'A' && c <= 'Z':
                    w = (v != '|' && v != 'v' && v != '~' && v != '~' && (v < 'A' || v > 'Z')) ? i : w;
                    break;
                case to_parse.length >= i+3 && to_parse.slice(i, i+3) == "_|_":
                    w = (v != '|' && v != 'v' && v != '~' && v != '~' && (v < 'A' || v > 'Z') && v != '_') ? i : w;
                    break;
                case c == '?':
                    w = (v != '|' && v != 'v' && v != '~' && v != '~' && (v < 'A' || v > 'Z') && v != '_' && v != '?') ? i : w;
                    break;
                default:
                    break;
            }
        }
        // recursively parse the string
        let c = to_parse[w];
        switch(true) {
            case c == '|':
                return new Cf_Would(
                    Formula.parse(to_parse.slice(0, w), atoms), 
                    Formula.parse(to_parse.slice(w+5, to_parse.length), atoms));
            case c == 'v':
                return new Disjunction(
                    Formula.parse(to_parse.slice(0, w), atoms),
                    Formula.parse(to_parse.slice(w+1, to_parse.length), atoms));
            case c == '~':
                return new Negation(Formula.parse(to_parse.slice(w+1, to_parse.length), atoms));
            case c == '(':
                let i = w;

                let unclosed_brackets = 1;
                while(i < to_parse.length && unclosed_brackets > 0) {
                    i++;
                    if(to_parse[i] == '(') { unclosed_brackets++; }
                    if(to_parse[i] == ')') { unclosed_brackets--; }
                }

                return Formula.parse(to_parse.slice(w+1, i), atoms);
            case c >= 'A' && c <= 'Z':
                return new Atom(atoms[c.charCodeAt(0) - 65]);
            case c == '_':
                return new Bottom();
            case c == '?':
                return new Any();
            default:
                break;
        }
        throw new Error("Failed to parse formula string: " + to_parse);
    }

    /**
     * Retrieve a string representation of this object
     * @returns A string representation of this object
     */
     abstract to_string(visited_atoms?: string[]): string;

    /**
     * Check this formulas structural equality with the passed one
     * @param comparand Formula
     * @returns A truth value of structural equality
     */
    abstract compare(comparand: Formula): boolean;

    /**
     * Retrieve the subformula reached by the passed path
     * @param path A string path to the subformula to retrieve (l-travel to left child, r-travel to right child, example: "llrlrllrr")
     */
    abstract get_child(path: string): Formula;
}

/**
 * A class representation of the counterfactual would operator
 */
export class Cf_Would extends Formula {
    antecedent: Formula;
    consequent: Formula;

    /**
     * Create a counterfactual would statement
     * @param antecedent Antecedent formula
     * @param consequent Consequent formula
     */
    constructor(antecedent: Formula, consequent: Formula) {
        super();
        this.antecedent = antecedent;
        this.consequent = consequent;
    }

    to_string(visited_atoms?: string[]): string {
        visited_atoms = visited_atoms ?? [];
        let is_bin = (f: Formula) => (f instanceof Cf_Would || f instanceof Disjunction);
        let left = this.antecedent.to_string(visited_atoms);
        let right = this.consequent.to_string(visited_atoms);
        return (is_bin(this.antecedent) ? "(" + left + ")" : left) + " |_|-> " + (is_bin(this.consequent) ? "(" + right + ")" : right);
    }

    compare(comparand: Formula): boolean {
        return (comparand instanceof Cf_Would && this.antecedent.compare(comparand.antecedent) && this.consequent.compare(comparand.consequent))
        || comparand instanceof Any;
    }

    get_child(path: string): Formula {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.antecedent.get_child(path.slice(1, path.length));
            case 'r':
                return this.consequent.get_child(path.slice(1, path.length));
            default:
                throw new Error("path string may only contain the letters 'l' and 'r'");
        }
    }
}

/**
 * A class representation of the disjunction negation operator
 */
export class Disjunction extends Formula {
    subject1: Formula;
    subject2: Formula;

    /**
     * Create a disjunction between two formulas
     * @param subject1 Formula to be disjunct
     * @param subject2 Formula to be disjunct
     */
    constructor(subject1: Formula, subject2: Formula) {
        super();
        this.subject1 = subject1;
        this.subject2 = subject2;
    }

    to_string(visited_atoms?: string[]): string {
        visited_atoms = visited_atoms ?? [];
        let is_bin = (f: Formula) => (f instanceof Cf_Would || f instanceof Disjunction);
        let left = this.subject1.to_string(visited_atoms);
        let right = this.subject2.to_string(visited_atoms);
        return (is_bin(this.subject1) ? "(" + left + ")" : left) + " v " + (is_bin(this.subject2) ? "(" + right + ")" : right);
    }

    compare(comparand: Formula): boolean {
        return (comparand instanceof Disjunction &&
            (this.subject1.compare(comparand.subject1) && this.subject2.compare(comparand.subject2)
            || this.subject1.compare(comparand.subject2) && this.subject2.compare(comparand.subject1)))
        || comparand instanceof Any;
    }

    get_child(path: string): Formula {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.subject1.get_child(path.slice(1, path.length));
            case 'r':
                return this.subject2.get_child(path.slice(1, path.length));
            default:
                throw new Error("path string may only contain the letters 'l' and 'r'");
        }
    }
}

/**
 * A class representation of the logical negation operator
 */
export class Negation extends Formula {
    subject: Formula;

    /**
     * Negate a formula
     * @param subject Formula to be negated
     */
    constructor(subject: Formula) {
        super();
        this.subject = subject;
    }

    to_string(visited_atoms?: string[]): string {
        let is_bin = (f: Formula) => (f instanceof Cf_Would || f instanceof Disjunction);
        let sub = this.subject.to_string(visited_atoms);
        return "~" + (is_bin(this.subject) ? "(" + sub + ")": sub);
    }

    compare(comparand: Formula): boolean {
        return (comparand instanceof Negation && this.subject.compare(comparand.subject))
        || comparand instanceof Any;
    }

    get_child(path: string): Formula {
        if(path.length == 0) { return this; }
        switch(path[0]) {
            case 'l':
                return this.subject.get_child(path.slice(1, path.length));
            default:
                throw new Error("Negation only has left child");
        }
    }
}

/**
 * A class representation of atomic statements
 */
export class Atom extends Formula {
    readonly value: string;

    /**
     * Create an atomic statement
     * @param value a linguistic description of the atomic statement
     */
    constructor(value: string) {
        super();
        this.value = value;
    }

    to_string(visited_atoms?: string[]): string {
        if(visited_atoms == undefined) { return "A"; }

        let index = visited_atoms?.findIndex((value) => value == this.value);
        if(index == -1) { 
            visited_atoms?.push(this.value);
            return String.fromCharCode(visited_atoms.length - 1 + 65); // TODO: check index + 65 < 97 else throw error
        } else {
            return String.fromCharCode(index + 65);
        }
    }

    compare(comparand: Formula): boolean {
        return (comparand instanceof Atom && this.value == comparand.value)
        || (comparand instanceof Atom && (this.value == undefined || comparand.value == undefined)) /* undefined indicating that an atom is meant to be generic and the notion of equality to be a notion of type */
        || comparand instanceof Any;
    }

    get_child(path: string): Formula {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }
}

/**
 * A class representation of the bottom symbol
 */
 export class Bottom extends Formula {
    
    /**
     * Create a bottom symbol
     */
    constructor() {
        super();
    }

    to_string(): string {
        return "_|_";
    }

    compare(comparand: Formula): boolean {
        return comparand instanceof Bottom || comparand instanceof Any;
    }

    get_child(path: string): Formula {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }
}

/**
 * A class representation of a placeholder for formula constituents
 */
export class Any extends Formula {

    /**
     * Create a formula constituent placeholder
     */
    constructor() {
        super();
    }

    to_string(): string {
        return "?";
    }

    compare(comparand: Formula): boolean {
        return true;
    }

    get_child(path: string): Formula {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }
}
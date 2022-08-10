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
    static parse(to_parse: String, atoms: String[]): Formula {
    //Syntax: "~(A v B) |_|-> (C v ~(D))"

        // search for weakest binder
        let w = 0;
        for(let i=0; i<to_parse.length; i++) {
            let c = to_parse[i];
            let v = to_parse[w];
            switch(true) {
                case c == '|':
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
                    while(i < to_parse.length && to_parse[i] != ')') { i++; }
                    break;
                case c >= 'A' && c <= 'Z':
                    w = (v != '|' && v != 'v' && v != '~' && v != '~' && (v < 'A' || v > 'Z')) ? i : w;
                    break;
                default:
                    break;
                // TODO: parse bottom symbol
            }
        }

        // recursively parse the string
        let c = to_parse[w];
        switch(true) {
            case c == '|':
                return new Cf_Would(
                    Formula.parse(to_parse.slice(0, w-1), atoms), 
                    Formula.parse(to_parse.slice(w+5, to_parse.length), atoms));
            case c == 'v':
                return new Disjunction(
                    Formula.parse(to_parse.slice(0, w-1), atoms),
                    Formula.parse(to_parse.slice(w+1, to_parse.length), atoms));
            case c == '~':
                return new Negation(Formula.parse(to_parse.slice(w+1, to_parse.length), atoms));
            case c == '(':
                let i = w;
                while(i < to_parse.length && to_parse[i] != ')') { i++; }
                return Formula.parse(to_parse.slice(w+1, i), atoms);
            case c >= 'A' && c <= 'Z':
                return new Atom(atoms[c.charCodeAt(0) - 65]);
            default:
                break;
        }
        throw new Error("Failed to parse formula string: " + to_parse);
    }

    /**
     * Check this formulas structural equality with the passed one
     * @param comparand Formula
     * @returns A truth value of structural equality
     */
    abstract compare(comparand: Formula): boolean;
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

    compare(comparand: Formula): boolean {
        return (comparand instanceof Cf_Would && this.antecedent.compare(comparand.antecedent) && this.consequent.compare(comparand.consequent))
        || comparand instanceof Any;
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

    compare(comparand: Formula): boolean {
        return (comparand instanceof Disjunction &&
            (this.subject1.compare(comparand.subject1) && this.subject2.compare(comparand.subject2)
            || this.subject1.compare(comparand.subject2) && this.subject2.compare(comparand.subject1)))
        || comparand instanceof Any;
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

    compare(comparand: Formula): boolean {
        return (comparand instanceof Negation && this.subject.compare(comparand.subject))
        || comparand instanceof Any;
    }
}

/**
 * A class representation of atomic statements
 */
export class Atom extends Formula {
    readonly value: String;

    /**
     * Create an atomic statement
     * @param value a linguistic description of the atomic statement
     */
    constructor(value: String) {
        super();
        this.value = value;
    }

    compare(comparand: Formula): boolean {
        return (comparand instanceof Atom && this.value == comparand.value)
        || comparand instanceof Any;
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

    compare(comparand: Formula): boolean {
        return comparand instanceof Bottom || comparand instanceof Any;
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

    compare(comparand: Formula): boolean {
        return true;
    }
}
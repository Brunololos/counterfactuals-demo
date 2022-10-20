import { Level } from "./Level";

let atoms: string[];
let worlds: string[][];
let world_positions: [number, number][];
let edges: [number, number, number][];

atoms = [
    "Es gibt Weltfrieden",
    "Es gibt Ananas auf Pizza",
    "Die Erde ist flach",
    "Es gibt Insekten",
    "Tempo-Taschentücher sind gelb"
];
worlds = [get(atoms, [1, 2, 4])];
world_positions = [[0, 0]];
edges = [[0, 0, 0]];

export let level1 = Level.create("Res", "A v B", atoms, "a/d", 0, -1, worlds, world_positions, edges);

atoms = [
    "Menschen leben unterirdisch",
    "Eisen ist teurer als Gold",
    "Kompasse funktionieren",
    "Die Erde hat ein Magnetfeld",
    "Die Produktion von Lippenstift ist verboten"
];
worlds = [get(atoms, [0, 1, 2, 4])];
world_positions = [[0, 0]];
edges = [[0, 0, 0]];

export let level2 = Level.create("Res", "(D ^ C) v A"/* "~(~D v ~C) v A" */, atoms, "a/d", 0, -1, worlds, world_positions, edges);

atoms = [
    "Käse ist ein pflanzliches Produkt",
    "Kühe sind vom Aussterben bedroht",
    "Milch ist ein Gift",
    "Erdöl ist ein Gift",
    "Die Zugspitze ist der höchste Berg der Welt",
    "Milch kann zu einem Bioplastik verarbeitet werden",
    "Laktose-intolerante Menschen können Milch verdauen",
];
worlds = [get(atoms, [0, 1, 2, 3, 4, 5])];
world_positions = [[0, 0]];
edges = [[0, 0, 0]];

export let level3 = Level.create("Res", "(C ^ D) v (G ^ F)"/* "~(~C v ~D) v ~(~G v ~F)" */, atoms, "a/d", 0, -1, worlds, world_positions, edges);

atoms = [
    "Es gibt den Weihnachtsmann",
    "Jedes Kind wird beschenkt",
];
worlds = [[], [atoms[1]], get(atoms, [0, 1]), [atoms[0]]];
world_positions = [[0, 0], [-50, -150], [-100, 100], [200, 50]];
edges = [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [0, 1, 1], [0, 2, 2], [0, 3, 3]];

export let level4 = Level.create("Res", "A |_|-> B", atoms, "a/d", 0, -1, worlds, world_positions, edges);

atoms = [
    "Alexander the Great died at the age of 32",
    "Alexander the Great attacked europe",
    "The romans defeated Alexander the Great",
    "The romans built aqueducts",
    "The greek gods became revered throughout europe",
    "The toga became a fashion staple"
];
worlds = [[atoms[0], atoms[3], atoms[5]], [atoms[0], atoms[2]], [atoms[4]], [atoms[1], atoms[2], atoms[3]], [atoms[1], atoms[4]]];
world_positions = [[0, 0], [-150, 0], [0, -150], [150, 0], [0, 150]];
edges = [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 0], [0, 1, 1], [0, 2, 2], [0, 3, 2], [0, 4, 3], [1, 2, 3]];

export let level5 = Level.create("Res", "(~A ^ B) |_|-> C"/* "~(A v ~B) |_|-> C" */, atoms, "a/d", 0, -1, worlds, world_positions, edges);

atoms = [
    "Blah",
    "Bleh",
    "Bluh",
    "Blih",
    "Bloh",
];
worlds = [[atoms[3], atoms[5]], [atoms[0], atoms[1], atoms[2]], [atoms[4]], [atoms[1], atoms[2], atoms[3]], [atoms[1], atoms[4]], atoms.slice(0, 5), []];
world_positions = [[0, 0], [-150, 0], [0, -150], [150, 0], [0, 150], [300, -150], [237, 203]];
edges = [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 0], [5, 5, 0], [6, 6, 0], [0, 1, 2],
        [0, 2, 4], [0, 3, 5], [0, 4, 6], [0, 6, 6], [1, 2, 3], [2, 5, 1], [3, 5, 4], [4, 6, 5], [5, 0, 4], [6, 5, 2]];

export let level6 = Level.create("Res", "~(A |_|-> B)"/* "~((~A v (B v ~C)) ^ ~A)" *//* "~(~(A v B v C) ^ (A v B))" *//* "(A v B) v C v (D v E)" */, atoms, "a/d", 0, -1, worlds, world_positions, edges);

export let levels = [level1, level2, level3, level4, level5, level6];

/// EXTRA
atoms = [
    "Milch ist ein Gift",
    "Erdöl ist ein Gift",
    "Laktose-intolerante Menschen können Milch nicht verdauen",
    "Milch kann zu Bioplastik verarbeitet werden"
  ];

  let show_att = "~~~(A v B)";
  let show_def = "A v (B v ~C)";
  let show_cf = "A |_|-> B";
  let show_att_cf = "~(A |_|-> B)";
  let show_atoms = "(A v B) |_|-> ~(C v ~D) v E";

  /*
  "~((A v B) v (A v B))"
  "(A v ~B) |_|-> (C v _|_)"
  "~~(~(A v B) v C)"
  "~~~~(~(((~A v B) v C) v ~D))"
  "A v ((_|_ v (C v D)) v ~_|_)"
  "A |_|-> ((_|_ v (C v D)) v ~_|_)"
  "~(((A v B) v (A v B)) v ((A v B) v (A v B)))"
  "~((~(A v B)) v ~((A v B) v ~(A v B)))"
  "~((A v ~_|_) |_|-> (C v D))"
  "~(~(_|_ v ~_|_) v ~(~_|_ v (_|_ v _|_)))"
  */

  function get<Type>(array: Type[], indices: number[]): Type[] {
    let selected: Type[] = [];
    for(let i=0; i<indices.length; i++) {
        selected.push(array[indices[i]]);
    }
    return selected;
  }
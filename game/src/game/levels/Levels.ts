import { Level, Level_State } from "./Level";

let levellist: Level_State[] = [];

let atoms: string[];
let worlds: string[][];
let world_positions: [number, number][];
let edges: [number, number, number][];
let text: string;
let text_icon_keys: string[];

atoms = [
    "Es regnet jeden Montag",
    "Menschen schwitzen nicht",
    "Eis schmilzt nicht"
];
worlds = [[]];
world_positions = [[0, 0]];
edges = [[0, 0, 0]];
text = "Du und dein Kopilot seid mit der wichtigen Mission betraut eine zweite Erde zu finden. "
     + "Zu diesem Zweck wurde euer Raumschiff mit einem bahnbrechenden Parallelwelten-antrieb ausgerüstet,\n"

     + "welcher Sprünge zu anderen Versionen der Erde ermöglicht.\n"
     + "Da diese Technologie noch gefährlich und unerprobt ist hat euer Boardcomputer eine Abfolge von Handlungsanweisungen berechnet, " /* Flugplan */
    
     + "mittels welcher eine neue Erde sicher erreichbar ist.\n\n\n"

     + "Du und dein Kopilot könnt es kaum erwarten und wollt beide der erste Mensch sein, "
     + "der auf der neuen Welt landet und einen großen Schritt für die Menschheit macht.\n"
    
     + "Natürlich solltet ihr bei eurem Wetteifer acht geben\n"
     + "nicht mit eurem Raumschiff ohne Treibstoff zu stranden,\n"
     + "denn Piloten unter deren Aufsicht ein Schiff stranded droht die Entlassung.";

text_icon_keys = ["pilots_icon", "", "", "true", "false"];

levellist.push(Level.create(/* "Top & Bottom" */"Reaching new Earth", "Res", "¯|¯ v _|_", atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

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
text = "Da die meisten Welten unbewohnbar sind,\n"
     + "muss vor einer Landung auf einem Planeten geprüft werden,\n"
     + "ob dort lebensfreundliche Bedingungen herrschen.\n"
     
     + "Glücklicherweise können die Schiffsscanner bereits im Voraus die Eigenschaften der Welten erfassen.\n"
     + "Erfüllte Eigenschaften werden um die Welten herum dargestellt.\n"

     + "Um also die Bewohnbarkeit einer Welt nachzuweisen gilt es den richtigen Bewohnbarkeitstest aus dem Handlungsplan auszuwählen."
     text_icon_keys = ["", "atom_0", "atom_0"];

levellist.push(Level.create(/* "Atoms" */"Habitability", "Res", "A v B", atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

atoms = [
    "Es gibt Weltfrieden", // TODO: Come up with other atoms
    "Es gibt Ananas auf Pizza",
    "Die Erde ist flach",
    "Es gibt Insekten",
    "Tempo-Taschentücher sind gelb"
];
worlds = [get(atoms, [0, 3, 4])];
world_positions = [[0, 0]];
edges = [[0, 0, 0]];
text = "In bestimmten Situationen sind sogar mehr als 2 Bewohnbarkeitstests durchführbar.";
text_icon_keys = [];

levellist.push(Level.create(/* "Nested Disjunction" */"Nested Habitability", "Res", "C v B v A", atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

atoms = [
    "Es gibt Weltfrieden", // TODO: Come up with other atoms
    "Es gibt Ananas auf Pizza",
    "Die Erde ist flach",
    "Es gibt Insekten",
    "Tempo-Taschentücher sind gelb",
    "Ahorn Sirup ist salzig"
];
worlds = [get(atoms, [2, 4, 5])];
world_positions = [[0, 0]];
edges = [[0, 0, 0]];
text = "Von Zeit zu Zeit plant der Boardcomputer auch Schichtwechsel für dich und deinen Kopiloten ein. "
     + "Bist du zu diesem Zeitpunkt der aktive Pilot, so ended deine Schicht und dein Kopilot übernimmt\n"
     + "die Kontrolle bis zum nächsten Schichtwechsel.\n"
     + "Selbstredend hat der momentan aktive Pilot immer zuerst die Möglichkeit auf einem Planeten zu landen.";
text_icon_keys = ["negation"];

levellist.push(Level.create(/* "Negation" */"Shift Switch", "Res", "~¯|¯ v ~A", atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

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
text = "";
text_icon_keys = [];

levellist.push(Level.create(/* "Double Negation" */"Double Shift Switch", "Res", "~A v ~~C", atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

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
text = "Achtung! Der Kopilot hat eine backdoor im Boardcomputer gefunden, mit der er die Kontrolle übernimmt und eine deiner Wahlmöglichkeiten überschreibt.";
text_icon_keys = ["conjunction"];

levellist.push(Level.create("Foul Play", "Res", "(D ^ C) v A"/* "~(~D v ~C) v A" */, atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

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
text = "";
text_icon_keys = [];

levellist.push(Level.create("Double Hack"/* "Conjunction 2" */, "Res", "(C ^ D) v (G ^ F)"/* "~(~C v ~D) v ~(~G v ~F)" */, atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

atoms = [
    "Die Mondlandung fand nie statt",
    "Die Sonne hat einen Zwillingsstern",
    "Der Neandertaler hat überlebt",
    "Sony und Microsoft sind fusioniert",
    "Atlantis ist nie untergegangen"
];
worlds = [[], get(atoms, [0, 2]), get(atoms, [1, 4]), get(atoms, [0, 1])];
world_positions = [[0, 0], [50, -150], [-100, 100], [150, 75]];
edges = [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0]];
text = "Endlich ist es an der Zeit für den ersten Parallelwelten-Sprung!\n"
     + "Wähle eine Welt aus, zu der du springen möchtest.";
text_icon_keys = ["possibility"];

levellist.push(Level.create("First Flight"/* "Possibility" */, "Res", "<>B", atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

atoms = [
    "Die Mondlandung fand nie statt",
    "Die Sonne hat einen Zwillingsstern",
    "Der Neandertaler hat überlebt",
    "Fluggesellschaften sind an der kommerziellen Raumfahrt beteiligt"
];
worlds = [[], get(atoms, [0, 2]), get(atoms, [1, 2]), get(atoms, [1, 3]), get(atoms, [0, 1]), get(atoms, [0, 1]), get(atoms, [3])];
world_positions = [[0, 0], [50, -150], [-100, 100], [150, 100], [30, 175], [175, -25], [-150, -50]];
edges = [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 0], [5, 5, 0], [6, 6, 0], [0, 1, 0], [0, 2, 0], [1, 5, 0], [2, 4, 0], [2, 6, 0], [5, 3, 0]];
text = "";
text_icon_keys = [];

levellist.push(Level.create("Successive Jumps"/* "Successive Possibility" */, "Res", "<><>D", atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

/*atoms = [
    "Es gibt die Farbe Rot",
    "Steinhauerei ist die verbreitetste Kunstform",
];
worlds = [[], [atoms[1]], get(atoms, [0, 1]), [atoms[0]]];
world_positions = [[0, 0], [-50, -150], [-100, 100], [200, 50]];
edges = [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0]];

levellist.push(Level.create("Necessity", "Res", "~[_]B", atoms, "d", 0, -1, worlds, world_positions, edges));

atoms = [
    "Es gibt den Weihnachtsmann",
    "Jedes Kind wird beschenkt",
];
worlds = [[], [atoms[1]], get(atoms, [0, 1]), [atoms[0]]];
world_positions = [[0, 0], [-50, -150], [-100, 100], [200, 50]];
edges = [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [0, 1, 1], [0, 2, 2], [0, 3, 3]];

levellist.push(Level.create("Counterfactual 1", "Res", "A |_|-> B", atoms, "d", 0, -1, worlds, world_positions, edges));

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
edges = [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 0], [0, 1, 1], [0, 2, 2], [0, 3, 2], [0, 4, 3]];

levellist.push(Level.create("Counterfactual 2", "Res", "(~A ^ B) |_|-> C" // "~(A v ~B) |_|-> C" , atoms, "d", 0, -1, worlds, world_positions, edges)); */

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
text = "";
text_icon_keys = [];

/* "~(A |_|-> (A |_|-> B))" *//* "~((~A v (B v ~C)) ^ ~A)" *//* "~(~(A v B v C) ^ (A v B))" *//* "(A v B) v C v (D v E)" */
levellist.push(Level.create("Test", "Res", "~(A ^ B)", atoms, "d", 0, -1, worlds, world_positions, edges, text, text_icon_keys));

export let levels = levellist;

export let level1 = levels[0];
export let level2 = levels[1];
export let level3 = levels[2];
export let level4 = levels[3];
export let level5 = levels[4];
export let level6 = levels[5];
export let level7 = levels[6];
export let level8 = levels[7];
export let level9 = levels[8];
export let level10 = levels[9];

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
import Phaser, { Game } from 'phaser';
import { Graph, World } from '../util/Graph';
import { Formula, Cf_Would, Disjunction, Negation, Atom, Bottom, Any } from '../util/Cf_Logic';
import { Rule, Rules, Rules_Controller } from '../util/Game_Rules';
import { Game_State } from '../util/Game_State';
import { Game_Controller } from '../util/Game_Controller';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
  }

  create() {
    const logo = this.add.image(400, 70, 'logo');

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });

    var F: Formula;
    F = new Atom("I am silly!");
    F = new Negation(new Atom("I am silly!"));
    F = new Disjunction(new Atom("I am savvy"), new Negation(new Atom("I am silly!")));

    var V: Formula;
    V = new Atom("I am silly!");
    V = new Negation(new Atom("I am very much silly!"));
    V = new Disjunction(new Negation(new Atom("I am silly!")), new Atom("I am savvy"));
    console.log("Structural equality of F & V: "+F.compare(V));

    let atoms = [
      "Milch ist ein Gift",
      "Erdöl ist ein Gift",
      "Laktose-intolerante Menschen können Milch nicht verdauen",
      "Milch kann zu Bioplastik verarbeitet werden"
    ];

    F = Formula.parse("A |_|-> (B v C)", atoms);
    console.log(F);

    var G = new Graph();
    for(let i=0; i<5; i++) {
      G.add_world(["Milch ist ein Gift"]);
    }
    G.add_edge(0, 4, 2);
    G.add_edge(1, 2, 4);
    G.add_edge(0, 3, -2);
    G.add_edge(3, 3, 2);
    G.add_edge(0, 1, 0);
    G.add_edge(0, 3, 2);
    G.add_edge(1, 4, 7);
    G.add_edge(1, 3, 3);
    G.add_edge(2, 1, 1);
    G.add_edge(3, 1, -5);

    G.print();

    console.log(G.get_worlds()[0].is_adj(1));

    var state = Game_State.create("Res", G, "~~(~(A v B) v C)", atoms, 0, "a/d");
    var GC = new Game_Controller(state);
    for(let i=0; i<5; i++) {
      GC.simulate();
    }
  }

}

import Phaser, { Game } from 'phaser';
import { Graph, World } from '../util/Graph';
import { Formula, Cf_Would, Disjunction, Negation, Atom, Bottom, Any } from '../util/Cf_Logic';
import { Rule, Rules, Rules_Controller } from '../game/Game_Rules';
import { Game_State } from '../game/Game_State';
import { Game_Controller } from '../game/Game_Controller';
import { Game_Turn_Type } from '../util/Game_Utils';
import { Graphics_Controller } from '../ui/Graphics_Controller';

export default class Demo extends Phaser.Scene {
  private game_controller!: Game_Controller;
  private graphics_controller!: Graphics_Controller;
  private game_over = false;

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
    /*F = new Atom("I am silly!");
    F = new Negation(new Atom("I am silly!"));
    F = new Disjunction(new Atom("I am savvy"), new Negation(new Atom("I am silly!")));

    var V: Formula;
    V = new Atom("I am silly!");
    V = new Negation(new Atom("I am very much silly!"));
    V = new Disjunction(new Negation(new Atom("I am silly!")), new Atom("I am savvy"));

    // funkily the to_string instances name the Atoms differently, which may lead to some confusion:
    // however naming is consistent, if you put F and V in one Formula
    console.log("F: "+F.to_string());
    console.log("V: "+V.to_string());
    console.log("VvF: "+new Disjunction(V, F).to_string());
  
    console.log("Structural equality of F & V: "+F.compare(V));*/

    let atoms = [
      "Milch ist ein Gift",
      "Erdöl ist ein Gift",
      "Laktose-intolerante Menschen können Milch nicht verdauen",
      "Milch kann zu Bioplastik verarbeitet werden"
    ];

    F = Formula.parse("A |_|-> (B v C)", atoms);
    /*console.log(F);
    console.log(F.to_string());*/

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

    //G.print();

    //console.log(G.get_worlds()[0].is_adj(1));

    var state = Game_State.create("Res", G, /*"~~(~(A v B) v C)"*/"~~~~(~(~A v B v C v ~D))", atoms, 0, "a/d");
    this.game_controller = new Game_Controller(state);
    this.graphics_controller = new Graphics_Controller(this);
  }

  update(time: number, delta: number): void {
    if(!this.game_over) {
      let turn = this.game_controller.determine_next_moves(); // TODO: find better workarouns than !
      let type = turn[0];
      let moves = turn[1];
      console.log(Game_Turn_Type[type]+" => "+Rules[moves[0].get_name()]);
      switch(type) {
        case Game_Turn_Type.Defenders_Choice:
            break;
        case Game_Turn_Type.Defenders_Resolution:
            break;
        case Game_Turn_Type.Attackers_Resolution:
            //this.graphics_controller!.animate_move(moves[0]);
            this.game_controller.execute_move(moves[0]);
            if(moves[0].get_name() == Rules.Attacker_Victory) {
              console.log("The attacker won the game!");
              this.game_over = true;
            } else if(moves[0].get_name() == Rules.Defender_Victory) {
              console.log("The defender won the game!");
              this.game_over = true;
            }
            break;
        case Game_Turn_Type.No_Moves:
            this.game_over = true;
            break;
      }
    }
  }

}

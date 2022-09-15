import Phaser, { Game } from 'phaser';
import { Graph, World } from '../util/Graph';
import { Formula, Cf_Would, Disjunction, Negation, Atom, Bottom, Any } from '../util/Cf_Logic';
import { Rule, Rules, Rules_Controller } from '../game/Game_Rules';
import { Game_State } from '../game/Game_State';
import { Game_Controller } from '../game/Game_Controller';
import { Game_Turn_Type } from '../util/Game_Utils';
import { Graphics_Controller } from '../ui/Graphics_Controller';
import { duplicate_texture, Game_Graphics_Mode, Graph_Graphics_Mode, hueshift_texture } from '../util/UI_Utils';
import Base_Scene from '../util/Base_Scene';

export default class Game_Scene extends Base_Scene {

  private game_controller!: Game_Controller;
  private graphics_controller!: Graphics_Controller;
  private starting_state!: Game_State;
  private game_over = false;

  constructor() {
    super('Game_Scene');
  }

  preload() {
    this.setup();
    
    Graphics_Controller.load_sprites(this);
  }

  create() {
    Graphics_Controller.configure_sprites(this);

    let atoms = [
      "Milch ist ein Gift",
      "Erdöl ist ein Gift",
      "Laktose-intolerante Menschen können Milch nicht verdauen",
      "Milch kann zu Bioplastik verarbeitet werden"
    ];

    atoms = [
      "Fakt1",
      "Fakt2",
      "Fakt3",
      "Fakt4",
      "Fakt5",
      "Fakt6"
    ];

    var G = new Graph();

    G.add_world(atoms.slice(0, 3));
    G.add_world(atoms.slice(0, 1));
    G.add_world(atoms.slice(0, 4));
    G.add_world(atoms.slice(0, 2));
    G.add_world(atoms.slice(0, 5));

    G.add_edge(0, 0, 2);
    G.add_edge(0, 1, 2);
    G.add_edge(0, 4, 2);
    G.add_edge(3, 4, 2);
    G.add_edge(0, 4, 2);
    G.add_edge(1, 2, 4);

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
    "A |_|-> ((_|_ v (C v D)) v ~_|_)"
    "~(((A v B) v (A v B)) v ((A v B) v (A v B)))"
    "~((~(A v B)) v ~((A v B) v ~(A v B)))"
    */
    var state = Game_State.create("Res", G, "A v ((_|_ v (C v D)) v ~_|_)", atoms, 0, "a/d");
    this.starting_state = state;
    this.game_controller = new Game_Controller(state);
    this.graphics_controller = new Graphics_Controller(this, this.get_canvas(), state);
  }

  update(time: number, delta: number): void {
    /* This MUST! be the first line */
    let now = Date.now();
    this.graphics_controller.update(now);

    if(!this.game_over && this.graphics_controller.is_ready()) {
      let atoms = this.starting_state.get_formula().generate_atom_list();
      let state = this.game_controller.get_state();
      let turn = this.game_controller.determine_next_moves();
      let type = turn[0];
      let moves = turn[1];
      let graphics_mode = this.graphics_controller.get_mode();
      console.log(Game_Turn_Type[type] + " => "+((moves[0] == undefined) ? "" : (moves.map((value) => Rules[value.get_name()])).reduce((previous, current) => previous + " or "+current)));

      let wait = false;
      let move!: Rule;
      let formula!: Formula;
      let world!: integer;

      switch(true) {
        case type == Game_Turn_Type.Defenders_Choice && graphics_mode == Game_Graphics_Mode.Formula:
          this.graphics_controller.set_choice(state, moves[0], moves[1], atoms);
          return;
        case type == Game_Turn_Type.Defenders_Choice && graphics_mode == Game_Graphics_Mode.Formula_Choice:
          move = this.graphics_controller.get_choice();
          formula = move.apply(state).get_formula();
          break;
        case graphics_mode == Game_Graphics_Mode.World_Choice:
          move = this.graphics_controller.get_choice();
          world = this.graphics_controller.get_world_choice();
          formula = move.apply(state).get_formula();
          break;
        case type == Game_Turn_Type.Defenders_Resolution && graphics_mode == Game_Graphics_Mode.Formula:
          move = moves[0];
          break;
        case type == Game_Turn_Type.Attackers_Resolution && graphics_mode == Game_Graphics_Mode.Formula:
          move = moves[0];
          break;
        case type == Game_Turn_Type.No_Moves:
          console.log("Cannot play any move! Game ended.");
          this.game_over = true;
          return;
      }

      // fetch world choice parameter if needed
      let req_delim = this.game_controller.does_require_delim(move);
      let world_choice_made = graphics_mode == Game_Graphics_Mode.World_Choice;
      let player_choice = type != Game_Turn_Type.Attackers_Resolution && type != Game_Turn_Type.Attackers_Choice;
      if(req_delim && !world_choice_made && player_choice) {
        this.graphics_controller.set_world_choice();
        return;
      } else if(req_delim && !world_choice_made && !player_choice) {
        world = turn[2]!;
      }

      if(!wait && !this.game_over) {
        this.game_controller.execute_move(move, world);
        if(type != Game_Turn_Type.Defenders_Choice) {
          this.graphics_controller.animate_move(state, move, atoms);
        } else {
          this.graphics_controller.set_formula(this.game_controller.get_state(), formula, atoms);
        }
      }

      this.game_over = this.did_game_end(move);
    }
  }

  on_resize(): void {
    this.graphics_controller.resize_graphics();
  }

  did_game_end(move: Rule): boolean {
    let name = move.get_name();
    (name == Rules.Attacker_Victory || name == Rules.Defender_Victory) ? console.log(Rules[name] + "! Game ended.") : undefined;
    return name == Rules.Attacker_Victory || name == Rules.Defender_Victory;
  }

}

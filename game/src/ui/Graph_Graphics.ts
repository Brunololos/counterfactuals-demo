import { cloneDeep, some } from "lodash";
import { Atom } from "../game/Cf_Logic";
import { Rules } from "../game/Game_Rules";
import { Game_State } from "../game/Game_State";
import { Star } from "../graphics/Star";
import Base_Scene from "../util/Base_Scene";
import { Graph } from "../util/Graph";
import { duplicate_texture, dye_texture, fill_texture, Game_Graphics_Mode, Graph_Graphics_Mode, is_world_choice, text_style } from "../util/UI_Utils";
import { ATOM_ALPHA, EDGE_ALPHA, IDLE_WORLD_COLOR, IDLE_WORLD_HIGHLIGHT_COLOR, INACTIVE_ATOM_ALPHA, INACTIVE_EDGE_ALPHA, WORLD_ALPHA, World_Animation, World_Animations, WORLD_BASE_HIGHLIGHT_ALPHA, WORLD_HIGHLIGHT_ALPHA } from "./animations/Graph_Animations";
import { Formula_Graphics, Formula_Graphics_Element, ICON_WIDTH } from "./Formula_Graphics";
import { Graphics_Controller } from "./Graphics_Controller";

const WORLD_WIDTH = 60;
const ATOM_WIDTH = 20;

const EDGE_STRIPE_WIDTH = 15;

export class Graph_Graphics extends Phaser.GameObjects.Container {
    private graphics_controller: Graphics_Controller;
    private game_state: Game_State;
    private graph: Graph;
    private worlds: World_Controller[] = [];
    private current_world: integer;
    private delim_world: integer = -1;
    private mode: Graph_Graphics_Mode = Graph_Graphics_Mode.Display;
    private chosen_world: integer = -1;
    private choice_made: boolean = false;

    private rocket: Phaser.GameObjects.Sprite;
    private animation: Phaser.Tweens.Timeline;
    
    constructor(scene: Phaser.Scene, x: number, y: number, state: Game_State, current_world: integer, world_positions: [number, number][], edges: [integer, integer, integer][], graphics_controller: Graphics_Controller) {
        super(scene, x, y);
        this.game_state = state;
        this.graph = this.game_state.get_graph();
        this.current_world = current_world;
        this.graphics_controller = graphics_controller;

        // add worlds
        let n = this.graph.get_V();
        if(world_positions.length != n) { throw new Error("Passed too many or too few positions!"); }
        for(let i=0; i<n; i++) {
            let vertex_atoms = this.graph.get_worlds()[i].get_atoms().filter((value) => state.get_atoms().includes(value));
            let world = new World_Controller(scene, world_positions[i][0], world_positions[i][1], i, vertex_atoms, this);
            this.worlds.push(world);
            world.add_to_container(this);
        }

        // add edges
        let wps = world_positions;
        for(let i=0; i<edges.length; i++) {
            let o = edges[i][0];
            let d = edges[i][1];
            let w = edges[i][2];
            if(o == d) { continue; }
            let edge = new Edge(scene, new Phaser.Math.Vector2(wps[o][0], wps[o][1]), new Phaser.Math.Vector2(wps[d][0], wps[d][1]), w);
            this.worlds[o].add_edge(edge);
            edge.add_to_container(this);
        }

        this.rocket = new Phaser.GameObjects.Sprite(scene, wps[this.current_world][0], wps[this.current_world][1], "rocket").setDisplaySize(WORLD_WIDTH + 30, WORLD_WIDTH + 30);
        this.add(this.rocket);

        // add atoms
        let vertices = this.graph.get_worlds();
        for(let i=0; i<vertices.length; i++) {
            let v = vertices[i];
            let vertex_atoms = this.worlds[i].get_atoms();//v.get_atoms().filter((value) => state.get_atoms().includes(value)); // TODO: theres not nice filtering going on here
            let x = world_positions[i][0];
            let y = world_positions[i][1];
            let r = 40;
            for(let j=0; j<vertex_atoms.length; j++) {
                let frac = j/vertex_atoms.length;
                let rad = frac * 2 * Math.PI;
                //this.add(new Phaser.GameObjects.Ellipse(scene, x+Math.cos(rad)*r, y+Math.sin(rad)*r, 10, 10, vertex_colors[state.get_atoms().findIndex((value) => value == vertex_atoms[j])]));
                let glow = new Phaser.GameObjects.Sprite(scene, x+Math.cos(rad)*r, y+Math.sin(rad)*r, "glow").setDisplaySize(ATOM_WIDTH, ATOM_WIDTH);
                let atom = new Phaser.GameObjects.Sprite(scene, x+Math.cos(rad)*r, y+Math.sin(rad)*r, "atom_" + state.get_atoms().findIndex((curr) => curr == vertex_atoms[j])).setDisplaySize(ATOM_WIDTH, ATOM_WIDTH);
                this.worlds[i].add_atom_sprite(glow);
                this.worlds[i].add_atom_sprite(atom);
                this.add(glow);
                this.add(atom);

                atom.setInteractive(); // TODO: possibly hightlight world of atom?
                atom.on('pointerover', () => {
                    atom.setDisplaySize(35, 35);
                    glow.setDisplaySize(35, 35);
                    let atoms = (graphics_controller.get_mode() == Game_Graphics_Mode.Formula || is_world_choice(graphics_controller.get_mode())) ? graphics_controller.get_formula_graphics().get_formula().get_atoms([vertex_atoms[j]]) : graphics_controller.get_choice_controller().get_atoms([vertex_atoms[j]]);
                    for(let i=0; i<atoms.length; i++) {
                        atoms[i].setDisplaySize(ICON_WIDTH + 10, ICON_WIDTH + 10);
                    }
                });
                atom.on('pointerout', () => {
                    atom.setDisplaySize(ATOM_WIDTH, ATOM_WIDTH);
                    glow.setDisplaySize(ATOM_WIDTH, ATOM_WIDTH);
                    let atoms = (graphics_controller.get_mode() == Game_Graphics_Mode.Formula || is_world_choice(graphics_controller.get_mode())) ? graphics_controller.get_formula_graphics().get_formula().get_atoms([vertex_atoms[j]]) : graphics_controller.get_choice_controller().get_atoms([vertex_atoms[j]]);
                    for(let i=0; i<atoms.length; i++) {
                        atoms[i].setDisplaySize(ICON_WIDTH, ICON_WIDTH);
                    }
                });
            }
        }

        //this.worlds[current_world].set_color(CURRENT_WORLD_COLOR, CURRENT_WORLD_HIGHLIGHT_COLOR);
        this.set_sphere(current_world);
    }

    set_mode(mode: Graph_Graphics_Mode) {
        switch(mode) {
            case Graph_Graphics_Mode.Display:
                break;
            case Graph_Graphics_Mode.World_Choice:
                this.choice_made = false;
                this.chosen_world = -1;
                break;
        }
        this.mode = mode;
    }

    resize() {
        let w = (this.scene as Base_Scene).get_width();
        let h = (this.scene as Base_Scene).get_height();
        this.setX(w/2);
        this.setY((h - 200)/2);
    }

    animate(mode: Game_Graphics_Mode) {
        // TODO:
        // set world hover formulas in graph_graphics
        let timeline;
        let current = this.graph.get_world(this.current_world);
        let blink_worlds: World_Controller[] = [];
        switch(mode) {
            case Game_Graphics_Mode.Sphere_Selection:
                for(let i=0; i<this.worlds.length; i++) {
                    if(!current.is_adj(i)) { continue; }
                    blink_worlds.push(this.worlds[i]);
                }
                timeline = World_Animations.create(this.scene, blink_worlds, World_Animation.BLINK);
                for(let i=0; i<blink_worlds.length; i++) {
                    this.worlds[i].set_animation(timeline);
                }
                break;
            case Game_Graphics_Mode.Counterfactual_World_Choice:
                let adj = current.get_edge_list();
                let r = adj.find((value) => (value[1] == this.delim_world))![2];
                for(let i=0; i<this.worlds.length; i++) {
                    if(!adj.some((value) => (value[1] == i && value[2] <= r))) { continue; }
                    blink_worlds.push(this.worlds[i]);
                }
                timeline = World_Animations.create(this.scene, blink_worlds, World_Animation.BLINK);
                for(let i=0; i<blink_worlds.length; i++) {
                    this.worlds[i].set_animation(timeline);
                }
                break;
            case Game_Graphics_Mode.Vacuous_World_Choice:
                for(let i=0; i<this.worlds.length; i++) {
                    if(!current.is_adj(i)) { continue; }
                    blink_worlds.push(this.worlds[i]);
                }
                timeline = World_Animations.create(this.scene, blink_worlds, World_Animation.BLINK);
                for(let i=0; i<blink_worlds.length; i++) {
                    this.worlds[i].set_animation(timeline);
                }
                break;
            default:
                break;
        }
        this.animation = timeline;
        timeline.play();
    }

    stop_animation() {
        if(this.animation != undefined) { this.animation.stop(); }
        for(let i=0; i<this.worlds.length; i++) {
            this.worlds[i].clear_animation();
        }
    }

    world_clicked(world: integer) {
        switch(this.mode) {
            case Graph_Graphics_Mode.Display:
                // TODO: Play some cute animation, expand atom-icons to textboxes
                break;
            case Graph_Graphics_Mode.World_Choice:
                let edge = this.game_state.get_graph().get_world(this.current_world).get_edges().find(x => (x[0].get_index() == world));
                let delim_edge = this.game_state.get_graph().get_world(this.current_world).get_edges().find(x => (x[0].get_index() == this.delim_world));
                let max_distance = (delim_edge != undefined) ? delim_edge[1] : Infinity;
                if(edge == undefined || edge[1] > max_distance) { return; }
                this.chosen_world = world;
                this.choice_made = true;
                console.log("Chose world: "+world);
                break;
        }
    }

    set_sphere(current_world: integer, distance = Infinity) {
        this.clear_sphere();
        this.set_current_world(current_world);

        let edges = this.graph.get_edges(current_world);
        for(let i=0; i<edges.length; i++) {
            if(edges[i][1] <= distance) {
                this.worlds[edges[i][0].index].set_active(true);
            }
        }
        let edge_graphics = this.worlds[current_world].get_edges();
        for(let i=0; i<edge_graphics.length; i++) {
            if(edge_graphics[i].get_weight() > distance) { continue; };
            let edge = edge_graphics[i].get_sprites();
            for(let j=0; j<edge.length; j++) {
                edge[j].setAlpha(EDGE_ALPHA);
            }
        }
    }

    set_current_world(current_world: integer) {
        //if(this.current_world != -1) { this.worlds[this.current_world].set_color(IDLE_WORLD_COLOR, IDLE_WORLD_HIGHLIGHT_COLOR); }
        this.current_world = current_world;
        this.worlds[current_world].set_active(true);
        //this.worlds[current_world].set_color(CURRENT_WORLD_COLOR, CURRENT_WORLD_HIGHLIGHT_COLOR);
        this.rocket.setPosition(this.worlds[this.current_world].get_x(), this.worlds[this.current_world].get_y());
    }

    set_delim_world(delim_world: integer) {
        this.delim_world = delim_world;
    }

    clear_hover_ellipse_alphas() {
        for(let i=0; i<this.worlds.length; i++) {
            this.worlds[i].get_hover_ellipse().setAlpha(WORLD_BASE_HIGHLIGHT_ALPHA);
        }
    }

    clear_delim_world() {
        if(this.delim_world != -1) { this.worlds[this.delim_world].set_color(IDLE_WORLD_COLOR, IDLE_WORLD_HIGHLIGHT_COLOR); }
        this.delim_world = -1;
    }

    clear_sphere() {
        for(let i=0; i<this.worlds.length; i++) {
            this.worlds[i].set_color(IDLE_WORLD_COLOR, IDLE_WORLD_HIGHLIGHT_COLOR);
            this.worlds[i].set_active(false);
            let edges = this.worlds[i].get_edges();
            for(let j=0; j<edges.length; j++) {
                let edge_sprites = edges[j].get_sprites();
                for(let k=0; k<edge_sprites.length; k++) {
                    edge_sprites[k].setAlpha(INACTIVE_EDGE_ALPHA);
                }
            }
        }
    }

    get_graphics_controller(): Graphics_Controller {
        return this.graphics_controller;
    }

    get_delim_world(): integer {
        return this.delim_world;
    }

    get_current_world(): integer {
        return this.current_world;
    }

    get_chosen_world(): integer {
        if(!this.choice_made) { throw new Error("No world choice has yet been made"); }
        return this.chosen_world;
    }

    is_choice_made(): boolean {
        return this.choice_made;
    }

    static load_sprites(scene: Phaser.Scene) {
        if(scene.textures.getTextureKeys().includes("world_shadow")) { return; }
        /* scene.load.image("arrowhead", "assets/Arrowhead.png");
        scene.load.image("arrowbody", "assets/Arrowbody.png");
        scene.load.image("arrowtail", "assets/Arrowtail.png"); */
        /* for(let i=1; i<12; i++) {
            scene.load.image("arrowhead_"+i.toString(), "assets/arrows/Arrowhead_"+i.toString()+".png");
            scene.load.image("arrowbody_"+i.toString(), "assets/arrows/Arrowbody_"+i.toString()+".png");
            scene.load.image("arrowtail_"+i.toString(), "assets/arrows/Arrowtail_"+i.toString()+".png");
        } */
        scene.load.image("arrowhead", "assets/arrows/Arrowhead_12.png");
        scene.load.image("arrowbody", "assets/arrows/Arrowbody_12.png");
        scene.load.image("arrowtail", "assets/arrows/Arrowtail_12.png");
        scene.load.image("marker", "assets/arrows/Ruler_Marker_3.png");
        scene.load.image("bat1c", "assets/Battery_1C.png");
        scene.load.image("bat2c", "assets/Battery_2C.png");
        scene.load.image("bat3c", "assets/Battery_3C.png");
        scene.load.image("arrowwave", "assets/Arrowwave.png");
        //scene.load.image("rocket", "assets/Rocket_Icon_Wide_Glow.png");
        scene.load.image("rocket", "assets/Fly_By.png");
        scene.load.image("world", "assets/Earth_Small.png");
        scene.load.image("grey_world", "assets/Earth_Grey.png");
    }

    static configure_sprites(scene: Phaser.Scene) {
        /* if(scene.textures.getTextureKeys().includes("world")) { return; }
        duplicate_texture(scene, "world_shadow", "world");
        fill_texture(scene, "world", 0x0C1324); */
    }
}

export class World_Controller {
    private x: number;
    private y: number;
    private graph_graphics: Graph_Graphics;
    private world: Phaser.GameObjects.Sprite;
    private hover_ellipse: Phaser.GameObjects.Ellipse;
    private index_text: Phaser.GameObjects.Text;
    private atoms: string[];
    private atom_sprites: Phaser.GameObjects.Sprite[] = [];
    private edges: Edge[] = [];
    private animation: Phaser.Tweens.Timeline | undefined;

    private index: integer;

    constructor(scene: Phaser.Scene, x_offset: number, y_offset: number, index: integer, atoms: string[], graph_graphics: Graph_Graphics) {
        this.x = x_offset;
        this.y = y_offset;
        this.atoms = atoms;
        this.world = new Phaser.GameObjects.Sprite(scene, x_offset, y_offset, "world").setAlpha(WORLD_ALPHA);
        this.hover_ellipse = new Phaser.GameObjects.Ellipse(scene, x_offset, y_offset, WORLD_WIDTH, WORLD_WIDTH, IDLE_WORLD_COLOR).setAlpha(WORLD_BASE_HIGHLIGHT_ALPHA);
        this.index_text = new Phaser.GameObjects.Text(scene, x_offset, y_offset, index.toString(), text_style).setOrigin(0.5, 0.5).setAlpha(0); // DISPLAY WORLD INDEX
        this.setup_listeners();
        this.index = index;
        this.graph_graphics = graph_graphics;
    }

    set_active(active: boolean) {
        this.world.setAlpha(active ? WORLD_ALPHA : 0.8/* INACTIVE_WORLD_ALPHA */);
        this.world.setTint(active ? 0xffffff : 0xbbbbbb);
        for(let i=0; i<this.atom_sprites.length; i++) {
            this.atom_sprites[i].setAlpha(active ? ATOM_ALPHA : INACTIVE_ATOM_ALPHA);
            this.atom_sprites[i].setTint(active ? 0xffffff : 0xbfbfbf);
            if(active) {
                this.atom_sprites[i].setInteractive();
            } else{
                this.atom_sprites[i].disableInteractive();
            }
        }
        if(active) {
            this.hover_ellipse.setInteractive();
        } else{
            this.hover_ellipse.disableInteractive();
        }
    }

    set_animation(animation: Phaser.Tweens.Timeline) {
        this.animation = animation;
    }

    clear_animation() {
        this.animation = undefined;
    }
    
    set_color(base_color: number, highlight_color: number) {
        this.hover_ellipse.fillColor = base_color;
        /* this.base_color = base_color;
        this.highlight_color = highlight_color; */
    }

    add_edge(edge: Edge) {
        this.edges.push(edge);
    }

    add_atom_sprite(atom_sprite: Phaser.GameObjects.Sprite) {
        this.atom_sprites.push(atom_sprite);
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.world);
        container.add(this.hover_ellipse);
        container.add(this.index_text);
    }

    get_hover_ellipse() {
        return this.hover_ellipse;
    }

    get_atoms(): string[] {
        return this.atoms;
    }

    get_edges(): Edge[] {
        return this.edges;
    }

    get_x(): number {
        return this.x;
    }

    get_y(): number {
        return this.y;
    }

    private setup_listeners() {
        this.hover_ellipse.setInteractive();
        this.hover_ellipse.on('pointerup', () => { this.graph_graphics.world_clicked(this.index); });

        this.hover_ellipse.on('pointerover', () => {
            this.graph_graphics.stop_animation();
            this.graph_graphics.clear_hover_ellipse_alphas();

            // TODO: in Cf World Choice, highlight sphere
            this.hover_ellipse.setAlpha(WORLD_HIGHLIGHT_ALPHA);

            for(let i=0; i<this.atom_sprites.length; i++) {
                this.atom_sprites[i].setDisplaySize(25, 25);
            }
            let graphics_controller = this.graph_graphics.get_graphics_controller();
            let atom_sprites = (graphics_controller.get_mode() == Game_Graphics_Mode.Formula || is_world_choice(graphics_controller.get_mode())) ? graphics_controller.get_formula_graphics().get_formula().get_atoms(this.atoms) : graphics_controller.get_choice_controller().get_atoms(this.atoms);
            for(let i=0; i<atom_sprites.length; i++) {
                atom_sprites[i].setDisplaySize(ICON_WIDTH + 10, ICON_WIDTH + 10); // TODO: +10 or +5 ?
            }
        });

        this.hover_ellipse.on('pointerout', () => {
            this.graph_graphics.clear_hover_ellipse_alphas();
            if(is_world_choice(this.graph_graphics.get_graphics_controller().get_mode())) { this.graph_graphics.animate(Game_Graphics_Mode.Sphere_Selection); }
            for(let i=0; i<this.atom_sprites.length; i++) {
                this.atom_sprites[i].setDisplaySize(ATOM_WIDTH, ATOM_WIDTH);
            }
            let graphics_controller = this.graph_graphics.get_graphics_controller();
            let atom_sprites = (graphics_controller.get_mode() == Game_Graphics_Mode.Formula || is_world_choice(graphics_controller.get_mode())) ? graphics_controller.get_formula_graphics().get_formula().get_atoms(this.atoms) : graphics_controller.get_choice_controller().get_atoms(this.atoms);
            for(let i=0; i<atom_sprites.length; i++) {
                atom_sprites[i].setDisplaySize(ICON_WIDTH, ICON_WIDTH);
            }
        });
    }
}

export class Edge {
    private arrowhead: Phaser.GameObjects.Sprite;
    private arrowbody: Phaser.GameObjects.Sprite;
    private arrowtail: Phaser.GameObjects.Sprite;
    private stars: Star[] = [];
    private markers: Phaser.GameObjects.Sprite[] = [];

    private label: Phaser.GameObjects.Text;
    private weight;

    // Origin and destination coords
    constructor(scene: Phaser.Scene, origin: Phaser.Math.Vector2, destination: Phaser.Math.Vector2, weight: integer) {
        this.weight = weight;

        let delta = new Phaser.Math.Vector2(destination.x - origin.x, destination.y - origin.y);
        let midpoint = origin.lerp(destination, 0.5);
        let arrow_len = delta.length() - WORLD_WIDTH;

        let arrowbody_len = arrow_len - 50 /* ARROWHEAD + ARROWTAIL WIDTH */;
        let arrowhead_offset = delta.setLength(arrow_len/2  - /* HALF OF ARROWHEAD WIDTH */12.5);

        this.arrowhead = new Phaser.GameObjects.Sprite(scene, midpoint.x + arrowhead_offset.x, midpoint.y + arrowhead_offset.y, "arrowhead");
        this.arrowbody = new Phaser.GameObjects.Sprite(scene, midpoint.x, midpoint.y, "arrowbody");
        this.arrowtail = new Phaser.GameObjects.Sprite(scene, midpoint.x - arrowhead_offset.x, midpoint.y - arrowhead_offset.y, "arrowtail");
        /* this.arrowhead = new Phaser.GameObjects.Sprite(scene, midpoint.x + arrowhead_offset.x, midpoint.y + arrowhead_offset.y, "arrowhead_"+weight.toString());
        this.arrowbody = new Phaser.GameObjects.Sprite(scene, midpoint.x, midpoint.y, "arrowbody_"+weight.toString());
        this.arrowtail = new Phaser.GameObjects.Sprite(scene, midpoint.x - arrowhead_offset.x, midpoint.y - arrowhead_offset.y, "arrowtail_"+weight.toString());*/

        this.arrowhead.setRotation(delta.angle());
        this.arrowbody.setScale(arrowbody_len/this.arrowbody.width, 1);
        this.arrowbody.setRotation(delta.angle());
        this.arrowtail.setRotation(delta.angle());

        // TODO: Find better way to convey weight
        // TODO: Also give a more exact edge-weight quantity, when hovering over the arrow
        let vis = 0.55;//0.5 + 0.5*(1/weight);
        this.arrowhead.setAlpha(vis);
        this.arrowbody.setAlpha(vis);
        this.arrowtail.setAlpha(vis);

        /* this.arrowhead.setScale(1, vis);
        this.arrowbody.setScale(arrowbody_len/this.arrowbody.width, vis);
        this.arrowtail.setScale(1, vis); */

        let label_width = 10;
        let label_height = 11;
    
        let label_offset = (delta.angle() > Math.PI/2 && delta.angle() <= Math.PI*3/2) ? new Phaser.Math.Vector2(- delta.y, delta.x) : new Phaser.Math.Vector2(delta.y, - delta.x);

        let a = label_offset.angle();
        let sect = Math.atan(label_height/label_width);
        let asect = Math.PI/2 - sect;
        let anc;
        switch(true) {
            case a >= 0 && a < sect:
                anc = label_width;
                break;
            case a >= sect && a < Math.PI/2:
                anc = label_height;
                a = a - sect;
                break;
            case a >= Math.PI/2 && a < Math.PI/2 + asect:
                anc = label_height;
                a = Math.PI/2 + asect - a;
                break;
            case a >= Math.PI/2 + asect && a < Math.PI:
                anc = label_width;
                a = a - (Math.PI/2 + asect);
                break;
            case a >= Math.PI && a < Math.PI + sect:
                anc = label_width;
                a = Math.PI + sect - a;
                break;
            case a >= Math.PI + sect && a < Math.PI*3/2:
                anc = label_height;
                a = a - (Math.PI + sect);
                break;
            case a >= Math.PI*3/2 && a < Math.PI*3/2 + asect:
                anc = label_height;
                a = Math.PI*3/2 + asect - a;
                break;
            case a >= Math.PI*3/2 + asect && a < Math.PI*2:
                anc = label_width;
                a = a - (Math.PI*3/2 + asect);
                break;
        }
        let d = (a/(Math.PI/4)) * (Math.PI/2);
        let label_offset_amount = anc/Math.cos(a);

        label_offset.setLength(label_offset_amount);
        let label_pos = midpoint.clone().add(label_offset);
        //let s = scene as Base_Scene;
        //scene.add.ellipse(midpoint.x + s.get_width()/2, midpoint.y + (s.get_height() - 200)/2, 5, 5, 0xff0000);
        //scene.add.ellipse(label_pos.x + s.get_width()/2, label_pos.y + (s.get_height() - 200)/2, 5, 5, 0xff0000);
        this.label = new Phaser.GameObjects.Text(scene, label_pos.x, label_pos.y - 2.5, weight.toString(), text_style);
        this.label.setOrigin(0.5, 0.5);

        // Setup stars
        let pos = midpoint.clone().subtract(delta.clone().setLength(arrow_len/2 - 12.5));
        let inc = delta.clone().setLength(arrowbody_len/weight);
        /* for(let i=0; i<weight; i++) {
            pos.add(inc);
            //let star = new Star(scene, pos.x, pos.y, 2.5);
            //this.stars.push(star);
            //this.markers.push(new Phaser.GameObjects.Sprite(scene, pos.x, pos.y, "marker").setRotation(delta.angle()));
        } */
        let bats = Math.ceil(weight/3);
        pos = midpoint.clone().add(label_offset).subtract(delta.clone().setLength(((bats - 1)/2)*20));
        inc = new Phaser.Math.Vector2(1, 0).setLength(20);//delta.clone().setLength(arrowbody_len/bats);
        for(let i=0; i<bats; i++) {
            switch(true) {
                case weight - i*3 >= 3:
                    this.markers.push(new Phaser.GameObjects.Sprite(scene, pos.x, pos.y, "bat3c")/* .setScale(0.75, 0.75) */);
                    break;
                case weight - i*3 == 2:
                    this.markers.push(new Phaser.GameObjects.Sprite(scene, pos.x, pos.y, "bat2c")/* .setScale(0.75, 0.75) */);
                    break;
                case weight - i*3 == 1:
                    this.markers.push(new Phaser.GameObjects.Sprite(scene, pos.x, pos.y, "bat1c")/* .setScale(0.75, 0.75) */);
                    break;
            }
            pos.add(inc);
        }
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.arrowhead);
        container.add(this.arrowbody);
        container.add(this.arrowtail);
        for(let i=0; i<this.stars.length; i++) {
            this.stars[i].add_to_container(container);
        }
        for(let i=0; i<this.markers.length; i++) {
           container.add(this.markers[i]);
        }
        //container.add(this.label);
    }

    get_sprites() {
        return [this.arrowhead, this.arrowbody, this.arrowtail].concat(this.markers);
    }

    get_weight() {
        return this.weight;
    }
}

export class Striped_Edge {
    private arrowhead: Phaser.GameObjects.Sprite;
    private arrowbody: Phaser.GameObjects.Sprite[] = [];
    private arrowtail: Phaser.GameObjects.Sprite;

    // Origin and destination coords
    constructor(scene: Phaser.Scene, origin: Phaser.Math.Vector2, destination: Phaser.Math.Vector2, length: integer) {
        let delta = new Phaser.Math.Vector2(destination.x - origin.x, destination.y - origin.y);
        let midpoint = origin.lerp(destination, 0.5);
        let arrow_len = delta.length() - WORLD_WIDTH;

        let arrowbody_len = arrow_len - 50 /* ARROWHEAD + ARROWTAIL WIDTH */;
        let arrowbody_midsection_len = arrowbody_len - EDGE_STRIPE_WIDTH*length*2 - EDGE_STRIPE_WIDTH; /* ARROWBODY - MIDSECTION*/;
        let arrowhead_offset = delta.setLength(arrow_len/2  - /* HALF OF ARROWHEAD WIDTH */12.5);

        let stripe_width = (arrowbody_len/(2*length+1));
        let stripe_offset = delta.clone().setLength(stripe_width*2);
        let arrowbody_midsection_offset = delta.clone().setLength(arrowbody_len/2 + stripe_width/2);

        this.arrowhead = new Phaser.GameObjects.Sprite(scene, midpoint.x + arrowhead_offset.x, midpoint.y + arrowhead_offset.y, "arrowhead_4");

        let stripepoint = midpoint.clone().add(arrowbody_midsection_offset.clone());
        for(let i=0; i<length; i++) {
            stripepoint = stripepoint.subtract(stripe_offset.clone());
            this.arrowbody.push(new Phaser.GameObjects.Sprite(scene, stripepoint.x, stripepoint.y, "arrowbody_4").setDisplaySize(stripe_width, 50).setRotation(delta.angle()));
        }
        //this.arrowbody = new Phaser.GameObjects.Sprite(scene, midpoint.x, midpoint.y, "arrowbody");
        this.arrowtail = new Phaser.GameObjects.Sprite(scene, midpoint.x - arrowhead_offset.x, midpoint.y - arrowhead_offset.y, "arrowtail_4");

        this.arrowhead.setRotation(delta.angle());
        //this.arrowbody.setScale(arrowbody_len/this.arrowbody.width, 1);
        //this.arrowbody.setRotation(delta.angle());
        this.arrowtail.setRotation(delta.angle());
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.arrowhead);
        for(let i=0; i<this.arrowbody.length; i++) {
            container.add(this.arrowbody[i]);
        }
        container.add(this.arrowtail);
    }
}

export class Stripe_Edge {
    private arrowhead: Phaser.GameObjects.Sprite;
    private arrowbody: Phaser.GameObjects.Sprite[] = [];

    // Origin and destination coords
    constructor(scene: Phaser.Scene, origin: Phaser.Math.Vector2, destination: Phaser.Math.Vector2, weight: integer) {
        let delta = new Phaser.Math.Vector2(destination.x - origin.x, destination.y - origin.y);
        let midpoint = origin.clone().lerp(destination, 0.5);
        let arrow_len = delta.length() - WORLD_WIDTH;

        let arrowbody_len = arrow_len - 50 /* ARROWHEAD + ARROWTAIL WIDTH */;
        let arrowbody_midsection_len = arrowbody_len - EDGE_STRIPE_WIDTH*length*2 - EDGE_STRIPE_WIDTH; /* ARROWBODY - MIDSECTION*/;
        let arrowhead_offset = delta.setLength(arrow_len/2  - /* HALF OF ARROWHEAD WIDTH */12.5);

        let stripe_width = 5 + (weight+1)*1.5;
        let stripe_offset = delta.clone().setLength(stripe_width*2);
        let arrowbody_midsection_offset = delta.clone().setLength(arrowbody_len/2 + stripe_width/2);

        this.arrowhead = new Phaser.GameObjects.Sprite(scene, midpoint.x + arrowhead_offset.x, midpoint.y + arrowhead_offset.y, "arrowhead");

        //this.arrowbody.push(new Phaser.GameObjects.Sprite(scene, midpoint.x, midpoint.y, "arrowbody").setDisplaySize(arrow_len, 300).setRotation(delta.angle()).setAlpha(0.2));
        let wave_origin = origin.clone().add(delta.clone().setLength(WORLD_WIDTH/2));
        let wave_destination = destination.clone().subtract(delta.clone().setLength(WORLD_WIDTH/2));
        for(let i=0; i<(arrow_len + 50)/50/* weight */; i++) {
            let wave = new Phaser.GameObjects.Sprite(scene, wave_origin.x, wave_origin.y, "arrowwave").setDisplaySize(10, 15/*25, 25*/).setRotation(delta.angle()).setAlpha(0.5);
            this.arrowbody.push(wave);
            scene.add.tween({
                targets: wave,
                x: wave_destination.x,
                y: wave_destination.y,
                duration: 15000,
                ease: 'Linear',
                yoyo: false,
                repeat: -1,
                delay: i*2000*(arrow_len/50)
            });
        }
        let stripepoint = origin.clone().add(delta.clone().setLength(WORLD_WIDTH/2 - stripe_width));
        for(let i=0; i < ((arrowbody_len + 25)/(stripe_width*2)); i++) {
            stripepoint = stripepoint.add(stripe_offset.clone());
            this.arrowbody.push(new Phaser.GameObjects.Sprite(scene, stripepoint.x, stripepoint.y, "arrowbody").setDisplaySize(stripe_width*2, 50).setRotation(delta.angle()));
        }

        this.arrowhead.setRotation(delta.angle());
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.arrowhead);
        for(let i=0; i<this.arrowbody.length; i++) {
            container.addAt(this.arrowbody[i], 0);
        }
    }
}
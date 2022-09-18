import { Game_State } from "../game/Game_State";
import Base_Scene from "../util/Base_Scene";
import { Graph } from "../util/Graph";
import { duplicate_texture, dye_texture, fill_texture, Graph_Graphics_Mode, text_style } from "../util/UI_Utils";

const WORLD_WIDTH = 60;
const ATOM_WIDTH = 20;

const EDGE_STRIPE_WIDTH = 15;

const IDLE_WORLD_COLOR = 0x9BBFE0;//0x7893AD;
const IDLE_WORLD_HIGHLIGHT_COLOR = 0xACD4FA;
const CURRENT_WORLD_COLOR = 0xE0AB79;
const CURRENT_WORLD_HIGHLIGHT_COLOR = 0xFBC087;//0xFDD87C;
const DELIM_WORLD_COLOR = 0x9C9BE0;
const DELIM_WORLD_HIGHLIGHT_COLOR = 0xAEACFA;//0xC6C5FA;

export class Graph_Graphics extends Phaser.GameObjects.Container {
    private game_state: Game_State;
    private graph: Graph;
    private worlds: World_Graphics[] = [];
    private current_world: integer;
    private delim_world: integer = -1;
    private mode: Graph_Graphics_Mode = Graph_Graphics_Mode.Display;
    private chosen_world: integer = -1;
    private choice_made: boolean = false;

    private rocket: Phaser.GameObjects.Sprite;
    
    constructor(scene: Phaser.Scene, x: number, y: number, state: Game_State, current_world: integer, world_positions: [number, number][], edges: [integer, integer, integer][]) {
        super(scene, x, y);
        this.game_state = state;
        this.graph = this.game_state.get_graph();
        this.current_world = current_world;

        // add worlds
        let n = this.graph.get_V();
        if(world_positions.length != n) { throw new Error("Passed too many or too few positions!"); }
        for(let i=0; i<n; i++) {
            let world = new World_Graphics(scene, world_positions[i][0], world_positions[i][1], i, this);
            this.worlds.push(world);
            this.add(world);
            //this.add(new Phaser.GameObjects.Text(scene, world_positions[i][0], world_positions[i][1], i.toString(), text_style).setOrigin(0.5, 0.5)); // DISPLAY WORLD INDEX
            this.add(new Phaser.GameObjects.Sprite(scene, world_positions[i][0], world_positions[i][1], "world").setAlpha(0.8));
        }

        // add edges
        let wps = world_positions;
        for(let i=0; i<edges.length; i++) {
            let o = edges[i][0];
            let d = edges[i][1];
            let w = edges[i][2];
            let e = new Edge(scene, new Phaser.Math.Vector2(wps[o][0], wps[o][1]), new Phaser.Math.Vector2(wps[d][0], wps[d][1]), w);
            e.add_to_container(this);
        }

        this.rocket = new Phaser.GameObjects.Sprite(scene, wps[this.current_world][0], wps[this.current_world][1], "rocket").setDisplaySize(WORLD_WIDTH + 30, WORLD_WIDTH + 30);
        this.add(this.rocket);
        this.worlds[current_world].set_color(CURRENT_WORLD_COLOR, CURRENT_WORLD_HIGHLIGHT_COLOR);

        // add atoms
        let vertices = this.graph.get_worlds();
        for(let i=0; i<vertices.length; i++) {
            let v = vertices[i];
            let vertex_atoms = v.get_atoms().filter((value) => state.get_atoms().includes(value)); // TODO: theres not nice filtering going on here
            let x = world_positions[i][0];
            let y = world_positions[i][1];
            let r = 40;
            for(let j=0; j<vertex_atoms.length; j++) {
                let frac = j/vertex_atoms.length;
                let rad = frac * 2 * Math.PI;
                //this.add(new Phaser.GameObjects.Ellipse(scene, x+Math.cos(rad)*r, y+Math.sin(rad)*r, 10, 10, vertex_colors[state.get_atoms().findIndex((value) => value == vertex_atoms[j])]));
                this.add(new Phaser.GameObjects.Sprite(scene, x+Math.cos(rad)*r, y+Math.sin(rad)*r, "glow").setDisplaySize(ATOM_WIDTH, ATOM_WIDTH));
                this.add(new Phaser.GameObjects.Sprite(scene, x+Math.cos(rad)*r, y+Math.sin(rad)*r, "atom_" + state.get_atoms().findIndex((curr) => curr == vertex_atoms[j])).setDisplaySize(ATOM_WIDTH, ATOM_WIDTH));
            }
        }
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

    set_current_world(current_world: integer) {
        if(this.current_world != -1) { this.worlds[this.current_world].set_color(IDLE_WORLD_COLOR, IDLE_WORLD_HIGHLIGHT_COLOR); }
        this.current_world = current_world;
        this.worlds[current_world].set_color(CURRENT_WORLD_COLOR, CURRENT_WORLD_HIGHLIGHT_COLOR);
        this.rocket.setPosition(this.worlds[this.current_world].x, this.worlds[this.current_world].y);
    }

    set_delim_world(delim_world: integer) {
        if(this.delim_world != -1) { this.worlds[this.delim_world].set_color(IDLE_WORLD_COLOR, IDLE_WORLD_HIGHLIGHT_COLOR); }
        this.delim_world = delim_world;
        this.worlds[delim_world].set_color(DELIM_WORLD_COLOR, DELIM_WORLD_HIGHLIGHT_COLOR);
    }

    clear_delim_world() {
        if(this.delim_world != -1) { this.worlds[this.delim_world].set_color(IDLE_WORLD_COLOR, IDLE_WORLD_HIGHLIGHT_COLOR); }
        this.delim_world = -1;
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
        scene.load.image("arrowhead", "assets/Arrowhead.png");
        scene.load.image("arrowbody", "assets/Arrowbody.png");
        scene.load.image("arrowtail", "assets/Arrowtail.png");
        scene.load.image("rocket", "assets/Rocket_Icon_Wide_Glow.png");
        scene.load.image("world_shadow", "assets/Earth_Small.png");
    }

    static configure_sprites(scene: Phaser.Scene) {
        duplicate_texture(scene, "world_shadow", "world");
        fill_texture(scene, "world", 0x0C1324);
    }
}

export class World_Graphics extends Phaser.GameObjects.Ellipse {
    private graph_graphics: Graph_Graphics;
    //private atoms: Phaser.GameObjects.Text[];
    //private transitions: Edge[];
    private base_color: number = IDLE_WORLD_COLOR;
    private highlight_color: number = IDLE_WORLD_HIGHLIGHT_COLOR;
    private index: integer;

    constructor(scene: Phaser.Scene, x_offset: number, y_offset: number, index: integer, graph_graphics: Graph_Graphics) {
        super(scene, x_offset, y_offset, WORLD_WIDTH, WORLD_WIDTH, IDLE_WORLD_COLOR);
        this.setup_listeners();
        this.index = index;
        this.graph_graphics = graph_graphics;
    }

    set_color(base_color: number, highlight_color: number) {
        this.fillColor = base_color;
        this.base_color = base_color;
        this.highlight_color = highlight_color;
    }

    private setup_listeners() {
        this.setInteractive();
        this.on('pointerup', () => { this.graph_graphics.world_clicked(this.index); });
        this.on('pointerover', () => { this.fillColor = this.highlight_color });
        this.on('pointerout', () => { this.fillColor = this.base_color });
    }
}

export class Edge {
    private arrowhead: Phaser.GameObjects.Sprite;
    private arrowbody: Phaser.GameObjects.Sprite;
    private arrowtail: Phaser.GameObjects.Sprite;

    private label: Phaser.GameObjects.Text;

    // Origin and destination coords
    constructor(scene: Phaser.Scene, origin: Phaser.Math.Vector2, destination: Phaser.Math.Vector2, weight: integer) {
        let delta = new Phaser.Math.Vector2(destination.x - origin.x, destination.y - origin.y);
        let midpoint = origin.lerp(destination, 0.5);
        let arrow_len = delta.length() - WORLD_WIDTH;

        let arrowbody_len = arrow_len - 50 /* ARROWHEAD + ARROWTAIL WIDTH */;
        let arrowhead_offset = delta.setLength(arrow_len/2  - /* HALF OF ARROWHEAD WIDTH */12.5);

        this.arrowhead = new Phaser.GameObjects.Sprite(scene, midpoint.x + arrowhead_offset.x, midpoint.y + arrowhead_offset.y, "arrowhead");
        this.arrowbody = new Phaser.GameObjects.Sprite(scene, midpoint.x, midpoint.y, "arrowbody");
        this.arrowtail = new Phaser.GameObjects.Sprite(scene, midpoint.x - arrowhead_offset.x, midpoint.y - arrowhead_offset.y, "arrowtail");

        this.arrowhead.setRotation(delta.angle());
        this.arrowbody.setScale(arrowbody_len/this.arrowbody.width, 1);
        this.arrowbody.setRotation(delta.angle());
        this.arrowtail.setRotation(delta.angle());

        // TODO: Find better way to conway weight
        // TODO: Also give a more exact edge-weight quantity, when hovering over the arrow
        let vis = 0.5 + 0.5*(1/weight);
        this.arrowhead.setAlpha(vis);
        this.arrowbody.setAlpha(vis);
        this.arrowtail.setAlpha(vis);

        this.arrowhead.setScale(1, vis);
        this.arrowbody.setScale(arrowbody_len/this.arrowbody.width, vis);
        this.arrowtail.setScale(1, vis);

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
        let label_offset_amount = anc/Math.cos(a); // NOTE: The sin( ___ + ...) was a feels right addition
        console.log(label_offset_amount);

        label_offset.setLength(label_offset_amount);
        let label_pos = midpoint.clone().add(label_offset);
        let s = scene as Base_Scene;
        //scene.add.ellipse(midpoint.x + s.get_width()/2, midpoint.y + (s.get_height() - 200)/2, 5, 5, 0xff0000);
        //scene.add.ellipse(label_pos.x + s.get_width()/2, label_pos.y + (s.get_height() - 200)/2, 5, 5, 0xff0000);
        this.label = new Phaser.GameObjects.Text(scene, label_pos.x, label_pos.y - 2.5, weight.toString(), text_style);
        this.label.setOrigin(0.5, 0.5);
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.arrowhead);
        container.add(this.arrowbody);
        container.add(this.arrowtail);
        container.add(this.label);
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

        this.arrowhead = new Phaser.GameObjects.Sprite(scene, midpoint.x + arrowhead_offset.x, midpoint.y + arrowhead_offset.y, "arrowhead");

        let stripepoint = midpoint.clone().add(arrowbody_midsection_offset.clone());
        for(let i=0; i<length; i++) {
            stripepoint = stripepoint.subtract(stripe_offset.clone());
            this.arrowbody.push(new Phaser.GameObjects.Sprite(scene, stripepoint.x, stripepoint.y, "arrowbody").setDisplaySize(stripe_width, 50).setRotation(delta.angle()));
        }
        //this.arrowbody = new Phaser.GameObjects.Sprite(scene, midpoint.x, midpoint.y, "arrowbody");
        this.arrowtail = new Phaser.GameObjects.Sprite(scene, midpoint.x - arrowhead_offset.x, midpoint.y - arrowhead_offset.y, "arrowtail");

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
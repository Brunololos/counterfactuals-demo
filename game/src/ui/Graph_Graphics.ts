import { Game_State } from "../game/Game_State";
import { Graph } from "../util/Graph";
import { Graph_Graphics_Mode, text_style } from "../util/UI_Utils";

export class Graph_Graphics extends Phaser.GameObjects.Container {
    private game_state: Game_State;
    private graph: Graph;
    private worlds: World_Graphics[] = [];
    private current_world: integer;
    private delim_world: integer = -1;
    private mode: Graph_Graphics_Mode = Graph_Graphics_Mode.Display;
    private chosen_world: integer = -1;
    private choice_made: boolean = false;
    
    constructor(scene: Phaser.Scene, x: number, y: number, state: Game_State, current_world: integer, world_positions: [number, number][], edges: [integer, integer][], atoms?: string[]) {
        super(scene, x, y);
        this.game_state = state;
        this.graph = this.game_state.get_graph();
        this.current_world = current_world;

        let n = this.graph.get_V();
        if(world_positions.length != n) { throw new Error("Passed too many or too few positions!"); }
        for(let i=0; i<n; i++) {
            let world = new World_Graphics(scene, world_positions[i][0], world_positions[i][1], i, this);
            this.worlds.push(world);
            this.add(world);
            this.add(new Phaser.GameObjects.Text(scene, world_positions[i][0], world_positions[i][1], i.toString(), text_style).setOrigin(0.5, 0.5));
        }

        let wps = world_positions;
        for(let i=0; i<edges.length; i++) {
            let o = edges[i][0];
            let d = edges[i][1];
            let e = new Edge(scene, new Phaser.Math.Vector2(wps[o][0], wps[o][1]), new Phaser.Math.Vector2(wps[d][0], wps[d][1]));
            e.add_to_container(this);
        }

        this.worlds[current_world].set_active(true);

        let vertex_colors = [0xFFCB42, 0x42855B, 0x533483, 0xC55300, 0xA2B5BB, 0xFF8FB1, 0xE94560, 0x84513D]; // TODO: find better way to do this
        let vertices = this.graph.get_worlds();
        for(let i=0; i<vertices.length; i++) {
            let v = vertices[i];
            let vertex_atoms = v.get_atoms().filter((value) => atoms!.includes(value)); // TODO: theres not nice filtering going on here
            let x = world_positions[i][0];
            let y = world_positions[i][1];
            let r = 30;
            for(let j=0; j<vertex_atoms.length; j++) {
                let frac = j/vertex_atoms.length;
                let rad = frac * 2 * Math.PI;
                this.add(new Phaser.GameObjects.Ellipse(scene, x+Math.cos(rad)*r, y+Math.sin(rad)*r, 10, 10, vertex_colors[atoms!.findIndex((value) => value == vertex_atoms[j])]));
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

    set_world_activity(world: integer, active: boolean) {
        this.worlds[world].set_active(active);
    }

    world_clicked(world: integer) {
        switch(this.mode) {
            case Graph_Graphics_Mode.Display:
                // TODO: Play some cute animation, expand atom-icons to textboxes
                break;
            case Graph_Graphics_Mode.World_Choice:
                if(this.game_state.get_current_world().get_edges().find(x => (x[0].get_index() == world)) == undefined) { return; } // TODO: pass adequade world criterion when setting up world choice
                this.chosen_world = world;
                this.choice_made = true;
                console.log("Chose world: "+world);
                break;
        }
    }

    set_current_world(current_world: integer) {
        if(this.current_world != -1) { this.set_world_activity(this.current_world, false); }
        this.current_world = current_world;
        this.worlds[current_world].set_active_color(0x554994);
        this.set_world_activity(this.current_world, true);
    }

    set_delim_world(delim_world: integer) {
        if(this.delim_world != -1) { this.set_world_activity(this.delim_world, false); }
        this.delim_world = delim_world;
        this.worlds[delim_world].set_active_color(0x277BC0);
        this.set_world_activity(this.delim_world, true);
    }

    clear_delim_world() {
        if(this.delim_world != -1) { this.set_world_activity(this.delim_world, false); }
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
}

export class World_Graphics extends Phaser.GameObjects.Ellipse {
    private graph_graphics: Graph_Graphics;
    //private atoms: Phaser.GameObjects.Text[];
    //private transitions: Edge[];
    private activation_color: number = 0x554994;
    private activation_highlight_color: number = 0xBE79DF;
    private world_active: boolean = false;
    private index: integer;

    constructor(scene: Phaser.Scene, x_offset: number, y_offset: number, index: integer, graph_graphics: Graph_Graphics) {
        super(scene, x_offset, y_offset, 40, 40, 0xE64848);
        this.setup_listeners();
        this.index = index;
        this.graph_graphics = graph_graphics;
    }

    set_active(active: boolean) {
        this.fillColor = active ? this.activation_color : 0xE64848;
        this.world_active = active;
    }

    set_active_color(color: number) {
        this.activation_color = color;
    }

    private setup_listeners() {
        this.setInteractive();
        this.on('pointerup', () => { this.graph_graphics.world_clicked(this.index); });
        this.on('pointerover', () => { this.fillColor = this.world_active ? this.activation_highlight_color : 0xFF5959; });
        this.on('pointerout', () => { this.fillColor = this.world_active ? this.activation_color : 0xE64848; });
    }
}

export class Edge {
    private arrowhead: Phaser.GameObjects.Sprite;
    private arrowbody: Phaser.GameObjects.Sprite;
    private arrowtail: Phaser.GameObjects.Sprite;

    // Origin and destination coords
    constructor(scene: Phaser.Scene, origin: Phaser.Math.Vector2, destination: Phaser.Math.Vector2) {
        let delta = new Phaser.Math.Vector2(destination.x - origin.x, destination.y - origin.y);
        let midpoint = origin.lerp(destination, 0.5);
        let arrow_len = delta.length() - 2*/* WORLD RADIUS */20; // TODO: pass radius

        let arrowbody_len = arrow_len - 50 /* ARROWHEAD + ARROWTAIL WIDTH */;
        let arrowhead_offset = delta.setLength(arrow_len/2  - /* HALF OF ARROWHEAD WIDTH */12.5);

        this.arrowhead = new Phaser.GameObjects.Sprite(scene, midpoint.x + arrowhead_offset.x, midpoint.y + arrowhead_offset.y, "arrowhead");
        this.arrowbody = new Phaser.GameObjects.Sprite(scene, midpoint.x, midpoint.y, "arrowbody");
        this.arrowtail = new Phaser.GameObjects.Sprite(scene, midpoint.x - arrowhead_offset.x, midpoint.y - arrowhead_offset.y, "arrowtail");

        this.arrowhead.setRotation(delta.angle());
        this.arrowbody.setScale(arrowbody_len/this.arrowbody.width, 1);
        this.arrowbody.setRotation(delta.angle());
        this.arrowtail.setRotation(delta.angle());
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.arrowhead);
        container.add(this.arrowbody);
        container.add(this.arrowtail);
    }
}
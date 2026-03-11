import { Rules } from "../game/Game_Rules";
import Base_Scene from "../util/Base_Scene";
import { Atom, Bottom, Cf_Might, Cf_Would, Conjunction, Disjunction, Formula, Necessity, Negation, Possibility, Top } from "../game/Cf_Logic";
import { duplicate_texture, dye_texture, fill_texture, Game_Graphics_Mode } from "../util/UI_Utils";
// TODO: implement space station equivalent: import { Formula_Animations } from "./animations/Formula_Animations";
import { cloneDeep } from "lodash";

export const ROOM_IMG_WIDTH = 80;
export const ROOM_WIDTH = 60;
const NUM_RECOLORS = 8;

export class Space_Station_Graphics extends Phaser.GameObjects.Container {
    private station: Space_Station_Graphics_Element;
    private atoms: string[];
    private embedding_depth: integer = 0;
    private tile_occupancy = new Map();

    constructor(scene: Base_Scene, x: number, y: number, formula: Formula, atoms: string[], embedding_depth: integer) {
        super(scene, x, y);

        this.atoms = cloneDeep(atoms);
        this.embedding_depth = embedding_depth;
        this.station = Space_Station_Graphics_Element.parse(scene, formula, 0, 0, this.tile_occupancy, this.atoms);
        this.station.add_to_container(this);
    }

    static load_sprites(scene: Phaser.Scene) {
        if(scene.textures.getTextureKeys().includes("false")) { return; }
        scene.load.image("room", "assets/spacestation/Room.png");
    }

    // TODO: dye sprites
    static configure_sprites(scene: Phaser.Scene) {
        if(scene.textures.getTextureKeys().includes("fill_open_0")) { return; }
        //let atom_colors = [0xF5C92A, 0x27577F, 0xFF577F, 0x27571B, 0xD3402A]; // TODO: make colors pop more like 0xFF577F,
        let atom_colors = [0xFFCB42, 0x42855B, 0x533483, /* 0xFF577F */0xFF4842, 0xA2B5BB, 0x47B5FF/* , 0x84513D */, 0xFF42CA, 0x2766FA]; // TODO: Fix wrong atom color
        //let atom_colors = [0xFFCB42, 0x42855B, 0x533483, 0xA2B5BB, 0xFF8FB1, 0x47B5FF, 0x84513D];
        // for(let i=0; i<NUM_RECOLORS; i++) {
        //     duplicate_texture(scene, "fill_open", "fill_open_"+(i).toString());
        //     duplicate_texture(scene, "fill_connect", "fill_connect_"+(i).toString());
        //     duplicate_texture(scene, "fill_closed", "fill_closed_"+(i).toString());

        //     duplicate_texture(scene, "atom", "atom_"+(i).toString());
        //     dye_texture(scene, "atom_"+(i).toString(), atom_colors[i]);
        // }
        /* duplicate_texture(scene, "possibility", "necessity")
        dye_texture(scene, "necessity", 0xdd3d3d) */
    }

    static key_of_pos(x: number, y: number) {
        return x.toString() + "_" + y.toString();
    }
}

export abstract class Space_Station_Graphics_Element extends Phaser.GameObjects.Sprite {

    /**
     * Retrieve the subspacestation graphics reached by the passed path
     * @param path A string path to the subspacestation graphics to retrieve (l-travel to left child, r-travel to right child, example: "llrlrllrr")
     */
    abstract get_child(path: string): Formula_Graphics_Element;

    /**
     * Create a graphics object tree representation of a counterfactual formula
     * @param to_parse A Formula to be represented by graphics
     * @returns The root object of a tree of formula graphics element objects
     */
    static parse(scene: Base_Scene, to_parse: Formula, x: number, y: number, tile_occupancy: Map, atoms: string[]=[], embedded: number=0): Formula_Graphics_Element {
        tile_occupancy.set(Space_Station_Graphics.key_of_pos(0, 0), true);
        let space_station = new Space_Station_Root(scene, 0, 0);
        // space_station.lay_out();
        return space_station;
    };

    abstract add_to_container(container: Phaser.GameObjects.Container): void;
}

/**
 * A class representation of an empty room
 */
 export class Space_Station_Room extends Space_Station_Graphics_Element {
    
    /**
     * Create an empty room
     */
    constructor(scene: Base_Scene, x: number, y: number) {
        super(scene, x, y, "room");
        this.setDisplaySize(ROOM_IMG_WIDTH, ROOM_IMG_WIDTH);
    }

    get_child(path: string): Space_Station_Graphics_Element {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }

    // offset(x: number): void {
    //     this.setX(this.x + x);
    // }

    // scale_recursive(s: number): void {
    //     this.setX(this.x * s);
    //     this.setScale(this.scaleX * s, this.scaleY * s);
    // }

    // set_depth(d: number): void {
    //     this.setDepth(d);
    // }

    // get_width(): number {
    //     return ICON_WIDTH*this.scaleX;
    // }

    // get_atoms(): Formula_Graphics_Element[] {
    //     return [];
    // }

    // get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
    //     return aux;
    // }

    // get_embedding(): Phaser.GameObjects.Sprite[] {
    //     return [];
    // }

    add_to_container(container: Phaser.GameObjects.Container): void {
        container.add(this);
    }
}

/**
 * A class representation of the space stations root
 */
 export class Space_Station_Root extends Space_Station_Graphics_Element {
    
    /**
     * Create the space station root
     */
    constructor(scene: Base_Scene, x: number, y: number) {
        super(scene, x, y, "room");
        this.setDisplaySize(ROOM_IMG_WIDTH, ROOM_IMG_WIDTH);
    }

    get_child(path: string): Space_Station_Graphics_Element {
        if(path.length == 0) { return this; }
        throw new Error("Cannot traverse any further");
    }

    // offset(x: number): void {
    //     this.setX(this.x + x);
    // }

    // scale_recursive(s: number): void {
    //     this.setX(this.x * s);
    //     this.setScale(this.scaleX * s, this.scaleY * s);
    // }

    // set_depth(d: number): void {
    //     this.setDepth(d);
    // }

    // get_width(): number {
    //     return ICON_WIDTH*this.scaleX;
    // }

    // get_atoms(): Formula_Graphics_Element[] {
    //     return [];
    // }

    // get_children(aux: Formula_Graphics_Element[] = []): Formula_Graphics_Element[] {
    //     return aux;
    // }

    // get_embedding(): Phaser.GameObjects.Sprite[] {
    //     return [];
    // }

    add_to_container(container: Phaser.GameObjects.Container): void {
        container.add(this);
    }
}

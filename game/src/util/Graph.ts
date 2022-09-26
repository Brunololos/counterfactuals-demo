import {cloneDeep} from 'lodash';

/** 
 * A basic graph representation class for directed weighted graphs
 */
 export class Graph {
    private worlds: World[];

    constructor() {
        this.worlds = [];
    }

    /**
     * Add a new world to the graph
     * @param atoms A list of atomic statements known to be true at this world
     */
    add_world(atoms?: string[]) {
        this.worlds = this.worlds.concat([new World(this.worlds.length, atoms ?? [])]);
    }

    /**
     * Create a new directed weighted edge between two worlds
     * @param origin The index of the world the edge is outgoing from
     * @param dest The index of the world the edge is pointing towards
     * @param weight A numerical edge weight
     */
    add_edge(origin: integer, dest: integer, weight: number) {
        this.worlds[origin].add_edge(this.worlds[dest], weight);
    }

    /**
     * Remove all worlds and edges from the graph
     */
    clear() {
        this.worlds = [];
    }

    /**
     * Determine whether this graph is identical to the passed one
     */
    equals(graph: Graph): boolean {
        if(this.get_V() != graph.get_V()) { return false; }
        if(this.get_E() != graph.get_E()) { return false; }
        for(let i=0; i<this.get_V(); i++) {
            let world_edges = graph.worlds[i].get_edges();
            let edges = this.worlds[i].get_edges();
            if(world_edges.length != edges.length) { return false; }
            for(let j=0; j<world_edges.length; j++) {
                if(world_edges[j][0].index != edges[j][0].index) { return false; }
                if(world_edges[j][1] != edges[j][1]) { return false; }
            }
        }
        return true;
    }

    get_world(index: integer): World {
        // TODO: guard index out of bounds
        return cloneDeep(this.worlds[index]);
    }

    /**
     * Retrieve a copy of the graphs worlds
     * @returns An array of worlds
     */
    get_worlds(): World[] {
        return cloneDeep(this.worlds);
    }

    /**
     * Retrieve a copy of a certain worlds edges
     * @param world The index of the world whose edges to retrieve
     * @returns A list of adjacency tuples consisting of a world and edge weight
     */
    get_edges(world: integer): [World, number][] {
        return cloneDeep(this.worlds[world].get_edges());
    }

    /**
     * Retrieve a flat list of all edges
     * @returns A list of adjacency tuples consisting of an origin world index, destination world index and edge weight
     */
     get_edge_list(): [number, number, number][] {
        let edges: [number, number, number][] = [];
        for(let i=0; i<this.worlds.length; i++) {
            let world = this.worlds[i];
            edges = edges.concat(world.get_edge_list());
        }
        return edges;
    }

    /**
     * Retrieve world count
     * @returns The graphs number of worlds V(G)
     */
    get_V(): integer {
        return this.worlds.length;
    }

    /**
     * Retrieve edge count
     * @returns The graphs number of edges E(G)
     */
    get_E(): integer {
        return this.worlds.reduce(
            (edge_sum, node) => edge_sum + node.get_edge_count(), 0);
    }

    /**
     * Print debug information
     */
    print() {
        console.log(this.get_V() + " vertices");
        console.log(this.get_E() + " edges");
        for(let i=0; i<this.worlds.length; i++) {
            let edgestring = "Vertex "+i+": ";
            const edge_count = this.worlds[i].get_edge_count();
            for(let j=0; j<edge_count; j++) {
                let edges = this.worlds[i].get_edges();
                edgestring = edgestring.concat("["+i+", "+edges[j][0].get_index()+"] ");
            }
            console.log(edgestring+"\n");
        }
    }

}

/**
 * A world class governing adjacency and other values pertaining to a single world
 */
export class World {
    readonly index: integer;
    private adj: [World, number][];
    private atoms: string[];

    constructor(index: integer, atoms: string[]) {
        this.index = index;
        this.adj = [];
        this.atoms = atoms;
    }

    /**
     * Create a weighted directed edge from this world to the passed one
     * @param world A world
     * @param weight A numerical edge weight
     */
    add_edge(world: World, weight: number) {
        this.adj = this.adj.concat([[world, weight]]);
    }

    /**
     * Retrieve the world index
     * @returns An index
     */
    get_index() {
        return this.index;
    }

    /**
    * Retrieve all atomic statements associated with this world
    * @returns A list of atomic statements
    */
    get_atoms(): string[] {
        return this.atoms;
    }

    /**
     * Retrieve a copy of the world adjacency list
     * @returns A list of adjacency tuples consisting of a world and edge weight
     */
    get_edges(): [World, number][] {
        return cloneDeep(this.adj);
    }

    /**
     * Retrieve an index representation of the world adjacency list
     * @returns A list of adjacency tuples consisting of an origin world index, destination world index and edge weight
     */
    get_edge_list(): [number, number, number][] {
        let edges: [number, number, number][] = [];
        let edge: [number, number, number];
        for(let i=0; i<this.adj.length; i++) {
            edge = [this.index, this.adj[i][0].index, this.adj[i][1]];
            edges = edges.concat([edge]);
        }
        return edges;
    }

    /**
     * Retrieve the world edge count
     * @returns The number of edges outgoing from this world
     */
    get_edge_count(): number {
        return this.adj.length;
    }

    /**
     * Retrieve an edge
     * @param world A world index of an adjacent world
     * @returns An edge to the passed world
     */
     get_edge(world: integer): [World, number] {
        let edge = this.adj.find(x => (x[0].get_index() == world));
        if(edge == undefined) { throw new Error("No edge to passed world"); }
        return edge;
    }

    /**
     * Check if this world has an outgoing edge to the passed indices world
     * @param world A world index
     * @returns The truth value of adjacency to the passed indices world
     */
    is_adj(world: integer): boolean {
        return this.adj.map(x => x[0].get_index()).includes(world);
    }

    /**
     * Check if the passed Atom is known to be true at this world
     * @param atom An atomic statement
     * @returns The truth value of the atom being known to be true at this world
     */
    is_atom_known_true(atom: string): boolean {
        return this.atoms.some((value: string) => (atom == value));
    }
}
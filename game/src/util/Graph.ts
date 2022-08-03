import {cloneDeep} from 'lodash';

/** 
 * A basic graph representation class for directed weighted graphs
 */
 export class Graph {
    private verts: Vert[];

    constructor() {
        this.verts = [];
    }

    /**
     * Add a new vertex to the graph
     */
    add_vertex() {
        this.verts = this.verts.concat([new Vert(this.verts.length, [])]);
    }

    /**
     * Create a new directed weighted edge between two vertices
     * @param origin The index of the vertex the edge is outgoing from
     * @param dest The index of the vertex the edge is pointing towards
     * @param weight A numerical edge weight
     */
    add_edge(origin: integer, dest: integer, weight: number) {
        this.verts[origin].add_edge(this.verts[dest], weight);
    }

    /**
     * Remove all vertices and edges from the graph
     */
    clear() {
        this.verts = [];
    }

    /**
     * Retrieve a copy of the graphs vertices
     * @returns An array of vertices
     */
    get_verts(): Vert[] {
        return cloneDeep(this.verts);
    }

    /**
     * Retrieve a copy of a certain vertices edges
     * @param vert The index of the vertex whose edges to retrieve
     * @returns A list of adjacency tuples consisting of a vertex and edge weight
     */
    get_edges(vert: integer): [Vert, number][] {
        return cloneDeep(this.verts[vert].get_edges());
    }

    /**
     * Retrieve vertex count
     * @returns The graphs number of vertices V(G)
     */
    get_V(): integer {
        return this.verts.length;
    }

    /**
     * Retrieve edge count
     * @returns The graphs number of edges E(G)
     */
    get_E(): integer {
        return this.verts.reduce(
            (edge_sum, node) => edge_sum + node.get_edge_count(), 0);
    }

    /**
     * Print debug information
     */
    print() {
        console.log(this.get_V() + " vertices");
        console.log(this.get_E() + " edges");
        for(let i=0; i<this.verts.length; i++) {
            let edgestring = "Vertex "+i+": ";
            const edge_count = this.verts[i].get_edge_count();
            for(let j=0; j<edge_count; j++) {
                let edges = this.verts[i].get_edges();
                edgestring = edgestring.concat("["+i+", "+edges[j][0].get_index()+"] ");
            }
            console.log(edgestring+"\n");
        }
    }

}

/**
 * A vertex class governing adjacency and other values pertaining to a single vertex
 */
export class Vert {
    readonly index: integer;
    private adj: [Vert, number][];
    private atoms: String[];

    constructor(index: integer, atoms: String[]) {
        this.index = index;
        this.adj = [];
        this.atoms = atoms;
    }

    /**
     * Create a weighted directed edge from this vertex to the passed one
     * @param vert A vertex
     * @param weight A numerical edge weight
     */
    add_edge(vert: Vert, weight: number) {
        this.adj = this.adj.concat([[vert, weight]]);
    }

    /**
     * Retrieve the vertex index
     * @returns An index
     */
    get_index() {
        return this.index;
    }

    /**
     * Retrieve a copy of the vertex adjacency list
     * @returns A list of adjacency tuples consisting of a vertex and edge weight
     */
    get_edges(): [Vert, number][] {
        return cloneDeep(this.adj);
    }

    /**
     * Retrieve all atomic statements associated with this vertex
     * @returns A list of atomic statements
     */
    get_atoms(): String[] {
        return this.atoms;
    }

    /**
     * Retrieve the vertex edge count
     * @returns The number of edges outgoing from this vertex
     */
    get_edge_count(): number {
        return this.adj.length;
    }

    /**
     * Check if this vertex has an outgoing edge to the passed indices vertex
     * @param vert A vertex index
     * @returns The truth value of adjacency to the passed indices vertex
     */
    is_adj(vert: integer): boolean {
        return this.adj.map(x => x[0].get_index()).includes(vert);
    }
}
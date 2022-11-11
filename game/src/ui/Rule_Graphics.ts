import { Formula } from "../game/Cf_Logic";
import Base_Scene from "../util/Base_Scene";
import { Formula_Graphics, ICON_WIDTH } from "./Formula_Graphics";
import { Edge } from "./Graph_Graphics";

export class Rule_Graphics {
    private scene: Phaser.Scene;
    private preformula_graphics: Formula_Graphics;
    private postformula_graphics: Formula_Graphics[] = [];
    private arrows: Edge[] = [];
    private arrow_sprites: Phaser.GameObjects.Container;

    constructor(scene: Base_Scene, x: number, y: number, preformula: string, postformulas: string[], atoms: string[], scale: number) {
        this.scene = scene;
        this.arrow_sprites = new Phaser.GameObjects.Container(scene, x, y);
        this.preformula_graphics = new Formula_Graphics(scene, x, y, Formula.parse(preformula, atoms), atoms);
        this.preformula_graphics.get_formula().scale_recursive(scale); // TODO: Size stuff at some point

        let prelen = this.preformula_graphics.get_formula().get_width();
        let post = postformulas.length;
        for(let i=0; i<post; i++) {
            let postformula = new Formula_Graphics(scene, x, y, Formula.parse(postformulas[i], atoms), atoms);
            postformula.get_formula().scale_recursive(scale);
            this.postformula_graphics.push(postformula);
            let edge = new Edge(scene, new Phaser.Math.Vector2(- ICON_WIDTH*0.9, 0), new Phaser.Math.Vector2(+ ICON_WIDTH*0.9, -(post-1)*ICON_WIDTH/2 + i*ICON_WIDTH), 0);
            edge.add_to_container(this.arrow_sprites);
            this.arrows.push(edge);
        }
        let postlen = this.postformula_graphics.map((value) => value.get_formula().get_width()).reduce((previous, current) => Math.max(previous, current));
        this.arrow_sprites.setX(x + prelen/2 - postlen/2);
        this.preformula_graphics.setX(x - ICON_WIDTH/2 - postlen/2);
        for(let i=0; i<post; i++) {
            this.postformula_graphics[i].setX(x + prelen/2 - postlen/2 + ICON_WIDTH/2 + this.postformula_graphics[i].get_width()/2);
        }
    }

    add_to_scene() {
        this.scene.children.add(this.preformula_graphics);
        let post = this.postformula_graphics.length;
        for(let i=0; i<post; i++) {
            this.scene.children.add(this.postformula_graphics[i]);
            this.postformula_graphics[i].setY(this.postformula_graphics[i].y-(post-1)*ICON_WIDTH/2 + i*ICON_WIDTH);
        }
        this.scene.children.add(this.arrow_sprites);
    }

    set_visible(visible: boolean) {
        this.preformula_graphics.setVisible(visible);
        for(let i=0; i<this.postformula_graphics.length; i++) {
            this.postformula_graphics[i].setVisible(visible);
        }
        this.arrow_sprites.setVisible(visible);
    }

    get_preformula(): Formula_Graphics {
        return this.preformula_graphics;
    }

    get_postformulas(): Formula_Graphics[] {
        return this.postformula_graphics;
    }
}
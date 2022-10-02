import Phaser, { Game } from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export default abstract class Base_Scene extends Phaser.Scene {
  private canvas!: HTMLCanvasElement;
    rexUI: RexUIPlugin;

  constructor(identifier: string) {
    super(identifier);
  }

  /**
   * Function configuring necessary Base_Scene properties
   * Call this function once during the preload stage of any child scene
   */
  setup() {
    this.canvas = this.sys.game.canvas;
    
    window.addEventListener("resize", () => {
        this.game.scale.resize(window.innerWidth, window.innerHeight);
        this.on_resize();
    }, false);
  }

  abstract on_resize(): void;

  get_canvas(): HTMLCanvasElement { return this.canvas; }
  get_width(): number { return window.innerWidth; }
  get_height(): number { return window.innerHeight; }
}

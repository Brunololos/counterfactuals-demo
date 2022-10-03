import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Game_Scene from './scenes/Game';
import Level_Select_Scene from './scenes/Level_Select';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  pixelArt: false,
  backgroundColor: "#55547A",//#c4dff9",//#EBE4BA",//#748DA6",//'#97D2EC',
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Level_Select_Scene, Game_Scene],
  plugins: {
    scene: [{
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI'
      },
    ]
  }
};

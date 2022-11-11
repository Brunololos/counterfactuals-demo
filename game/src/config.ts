import Phaser from 'phaser';
import GlowFilterPostFx from 'phaser3-rex-plugins/plugins/glowfilterpipeline.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import GlowFilterPipelinePlugin from 'phaser3-rex-plugins/plugins/glowfilterpipeline-plugin.js';
import Game_Scene from './scenes/Game';
import Level_Select_Scene from './scenes/Level_Select';
import Main_Menu_Scene from './scenes/Main_Menu';

export default {
  type: Phaser.WEBGL,
  parent: 'game',
  pixelArt: false,
  backgroundColor: "#55547A",//#c4dff9",//#EBE4BA",//#748DA6",//'#97D2EC',
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Main_Menu_Scene, Level_Select_Scene, Game_Scene],
  pipeline: [GlowFilterPostFx],
  plugins: {
    scene: [{
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI'
      },
      {
        key: 'rexGlowFilterPipeline',
        plugin: GlowFilterPipelinePlugin,
        mapping: 'rexGlowFilterPipeline',
        start: true
    },
    ]
  }
};

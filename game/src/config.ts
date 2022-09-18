import Phaser from 'phaser';

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
  scene: 'Game_Scene'
};

import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  pixelArt: false,
  backgroundColor: '#97D2EC',
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: 'Game_Scene'
};

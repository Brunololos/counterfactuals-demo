import Phaser from 'phaser';
import config from './config';
import Game_Scene from './scenes/Game';
import Level_Select_Scene from './scenes/Level_Select';

new Phaser.Game(
  Object.assign(config, {
    scene: [Level_Select_Scene, Game_Scene]
  })
);

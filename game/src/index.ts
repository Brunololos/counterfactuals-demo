import Phaser from 'phaser';
import config from './config';
import Game_Scene from './scenes/Game';
import Level_Select_Scene from './scenes/Level_Select';
import Main_Menu_Scene from './scenes/Main_Menu';

new Phaser.Game(
  Object.assign(config, {
    scene: [Main_Menu_Scene, Level_Select_Scene, Game_Scene]
  })
);

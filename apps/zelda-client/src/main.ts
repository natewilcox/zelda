import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { Bootstrap } from "./scenes/Bootstrap";
import { HUD } from "./scenes/HUD";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 },
        }
    },
    backgroundColor: 'black',
    scene: [Bootstrap]
} as Phaser.Types.Core.GameConfig;

const game = new Phaser.Game(config);
game.scene.add('game', GameScene, false);
game.scene.add('hud', HUD, false);
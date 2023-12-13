import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { Bootstrap } from "./scenes/Bootstrap";
import { HUD } from "./scenes/HUD";
import * as data from "./version.json";

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

const versionDiv = document.createElement('div');
versionDiv.textContent = `Build Version: ${data.version} - ${data.date}`;
versionDiv.style.position = 'fixed';
versionDiv.style.fontSize = '10px';
versionDiv.style.bottom = '0';
versionDiv.style.left = '0';
versionDiv.style.zIndex = '1000';
versionDiv.style.padding = '2px 10px';
versionDiv.style.fontFamily = 'Courier New, monospace';
document.body.appendChild(versionDiv);
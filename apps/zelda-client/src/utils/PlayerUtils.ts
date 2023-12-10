import { Link } from "../characters/Link";
import { GameScene } from "../scenes/GameScene";

export function createPlayer(scene: GameScene, key: string, x: number, y: number, frame?: string) {

    const player = new Link(scene, x, y, 1, 'Link')

    if(frame) { 
        player.anims.play(frame);
    }
    
    return player;
}
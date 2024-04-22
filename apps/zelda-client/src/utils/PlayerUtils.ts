import { Link } from "../characters/Link";
import { GameScene } from "../scenes/GameScene";

export function createPlayer(scene: GameScene, key: string, id: number, x: number, y: number, frame?: string) {

    const player = new Link(scene, x, y, 1, 'Link')
    player.id = id;
    
    if(frame) { 
        player.anims.play(frame);
    }
    
    return player;
}
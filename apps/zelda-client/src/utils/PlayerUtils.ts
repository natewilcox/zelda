import { IPlayerState } from "@natewilcox/zelda-shared";
import { GameScene } from "../scenes/GameScene";
import { Player } from "../objects/Player";

export function createPlayer(scene: GameScene, playerState: IPlayerState) {

    const { id, x, y } = playerState;

    //create player standing south
    console.log(`creating player ${id} at ${x}, ${y}`)

    const player = new Player(scene, x, y, id, 'Link', 'link-stand-south');
  
    player.playerState = playerState;
    player.anims.play('link-stand-south', true);

    return player;
}
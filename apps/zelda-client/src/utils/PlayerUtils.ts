import { IPlayerState } from "@natewilcox/zelda-shared";
import { Link } from "../characters/Link";
import { GameScene } from "../scenes/GameScene";

export function createPlayer(scene: GameScene, playerState: IPlayerState) {

    const { id, x, y } = playerState;

    //create player standing south
    console.log(`creating player ${id} at ${x}, ${y}`)

    const player = new Link(scene, x, y, 1, 'Link')
    player.id = id;
    player.playerState = playerState;
    player.anims.play('link-stand-south', true);

    return player;
}
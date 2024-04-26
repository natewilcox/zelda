import type { GameObject, Component } from "@natewilcox/nathan-core";
import { GameScene } from "../scenes/GameScene";
import { Player } from "../objects/Player";

export class ServerControlledComponent implements Component {

    private scene: GameScene;
    private player: Player;

    constructor(scene: GameScene) {
        this.scene = scene;
    }

    init(go: Phaser.GameObjects.GameObject & GameObject) {

        this.player = go as Player;

        //server controlled player
        console.log(`server controlled player ${this.player.id}`);
    }

    update(dt: number, t: number) {

        //get the direction the player should walk
        let dx = this.player.playerState.x - this.player.x;
        let dy = this.player.playerState.y - this.player.y;

        //if the player is close enough to the target, stop moving
        if(dx < 1 && dx > -1) dx = 0;
        if(dy < 1 && dy > -1) dy = 0;

        this.player.dir.setTo(dx, dy).normalize().scale(this.player.speed);
    }
}

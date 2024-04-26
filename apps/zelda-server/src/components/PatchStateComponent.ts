import type { GameObject, Component } from "@natewilcox/nathan-core";
import { Player } from "../objects/Player";

export class PatchStateComponent implements Component {

    private scene: Phaser.Scene;
    private player: Player;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    init(go: Phaser.GameObjects.GameObject & GameObject) {

        this.player = go as Player;
        console.log(`player ${this.player.id} will be patched.`);
    }

    update(dt: number, t: number) {
       
        this.player.playerState.x = this.player.x;
        this.player.playerState.y = this.player.y;
        
        //console.log(`patching player ${this.player.playerState.id} at ${this.player.playerState.x}, ${this.player.playerState.y}.`);
    };
}

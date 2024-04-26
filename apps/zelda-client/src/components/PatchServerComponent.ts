import type { GameObject, Component } from "@natewilcox/nathan-core";
import { GameScene } from "../scenes/GameScene";
import { ClientMessages } from "@natewilcox/zelda-shared";
import { Player } from "../objects/Player";

export class PatchServerComponent implements Component {

    private scene: GameScene;
    private player: Player;
    
    private patchRate: number;
    private timer: number = 0;

    constructor(scene: GameScene, patchRate: number) {
        this.scene = scene;
        this.patchRate = 1000 / patchRate;
    }

    init(go: Phaser.GameObjects.GameObject & GameObject) {

        this.player = go as Player;
        console.log(`player ${this.player.id} is controlled locally.`);
    }

    update(dt: number, t: number) {
       
        //check if the patch rate timer has been met before patching server state
        this.timer += t;
        if(this.timer < this.patchRate) return;

        //reset the timer and send patch info to the server
        this.timer = 0;

        const patch = this.createPatch();

        //console.log(`patching player ${this.character.id}`, patch);
        this.scene.SERVER.send(ClientMessages.PatchPlayerState, patch);
    };

    private createPatch() {

        //generate a patch based on changes to state
        const patch: any = {};
        
        //add position if changed
        if(this.player.x !== this.player.playerState.x || this.player.y !== this.player.playerState.y) {
            patch.x = this.player.x;
            patch.y = this.player.y;
        }

        return patch;
    }
}

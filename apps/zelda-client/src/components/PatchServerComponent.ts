import type { GameObject, Component } from "@natewilcox/nathan-core";
import { GameScene } from "../scenes/GameScene";
import { ClientMessages } from "@natewilcox/zelda-shared";
import { Character } from "../characters/Character";

export class PatchServerComponent implements Component {

    private scene: GameScene;
    private character: Character;
    
    private patchRate: number;
    private timer: number = 0;

    constructor(scene: GameScene, patchRate: number) {
        this.scene = scene;
        this.patchRate = 1000 / patchRate;
    }

    init(go: Phaser.GameObjects.GameObject & GameObject) {

        this.character = go as Character;
        console.log(`patching player ${this.character.id}`);
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
        if(this.character.playerState.x !== this.character.x) patch.x = this.character.x;
        if(this.character.playerState.y !== this.character.y) patch.y = this.character.y;

        return patch;
    }
}

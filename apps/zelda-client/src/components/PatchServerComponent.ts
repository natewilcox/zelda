import type { GameObject, Component } from "@natewilcox/nathan-core";
import { Link } from "../characters/Link";
import { GameScene } from "../scenes/GameScene";
import { ClientMessages } from "@natewilcox/zelda-shared";
import { Character } from "../characters/Character";

export class PatchServerComponent implements Component {

    private scene: GameScene;
    private character: Character;

    private propertyMap = {
        x: 'x',
        y: 'y'
    };

    constructor(scene: GameScene) {
        this.scene = scene;
    }

    init(go: Phaser.GameObjects.GameObject & GameObject) {

        this.character = go as Character;
        console.log(`patching player ${this.character.id}`);
    }

    update(dt: number, t: number) {
       
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

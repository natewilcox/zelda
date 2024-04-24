import type { GameObject, Component } from "@natewilcox/nathan-core";
import { Link } from "../characters/Link";
import { GameScene } from "../scenes/GameScene";

export class ServerControlledComponent implements Component {

    private scene: GameScene;
    private go: Phaser.GameObjects.GameObject & GameObject;

    constructor(scene: GameScene) {
        this.scene = scene;
    }

    init(go: Phaser.GameObjects.GameObject & GameObject) {
        this.go = go;

        if(this.go instanceof Link) {
            
            //server controlled player
            console.log(`server controlled player ${this.go.id}`)

            const link = this.go as Link;
            const playerState = link.playerState;

            playerState.onChange(() => {
                link.x = playerState.x;
                link.y = playerState.y;
            });
        }
    }
}

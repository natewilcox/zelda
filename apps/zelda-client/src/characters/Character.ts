import { StateMachine } from "@natewilcox/nathan-core";
import { IPlayerState } from "@natewilcox/zelda-shared";

export class Character extends Phaser.Physics.Arcade.Sprite {

    id: number;
    name: string;
    
    speed: number;
    dir: Phaser.Math.Vector2;

    playerState: IPlayerState;
    stateMachine: StateMachine;

    constructor(scene: Phaser.Scene, x: number, y: number, id: number, name: string, texture: string) {
        super(scene, x, y, texture);

        this.id = id;
        this.name = name;

        this.speed = 100;
        this.dir = new Phaser.Math.Vector2();

        this.stateMachine = new StateMachine(this, 'character_fsm');

        scene.add.existing(this);
        scene.physics.world.enable(this);
    }

    update(dt: number) {
        this.stateMachine.update(dt);
    }
}
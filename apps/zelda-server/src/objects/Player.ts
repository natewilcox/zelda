import { IPlayerState } from "@natewilcox/zelda-shared";

export class Player extends Phaser.Physics.Arcade.Sprite {

    id: number;
    name: string;
    dir: Phaser.Math.Vector2;
    speed: number;
    playerState: IPlayerState;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        console.log(`player created at ${x}, ${y}.`);
        
        this.dir = new Phaser.Math.Vector2();
        this.speed = 100;

        scene.add.existing(this);
        scene.physics.world.enable(this);
    }

    moveTowards(x: number, y: number) {
        this.scene.physics.moveTo(this, x, y, this.speed);
    }

    stopMoving() {
        this.setVelocity(0, 0);
    }
}
import { StateMachine } from "@natewilcox/nathan-core";
import { IPlayerState } from "@natewilcox/zelda-shared";

export class Player extends Phaser.Physics.Arcade.Sprite {

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

        this.stateMachine
        .addState("walking", {
            onUpdate: this.onWalkingUpdate
        })
        .setState("walking");
    }

    update(dt: number) {
        this.stateMachine.update(dt);
    }

    private onWalkingUpdate() {
 
        const dx = this.dir.x;
        const dy = this.dir.y;
        const mostlyHorizontal = Math.abs(dx) >= Math.abs(dy);
    
        if(dx == 0 && dy == 0) {
            const parts = this.anims.currentAnim.key.split("-");
            const dir = parts[2] != undefined ? parts[2] : 'south';
            this.anims.play(`link-stand-${dir}`, true);
        }
        else {
   
            if(dx < 0 && mostlyHorizontal) {
                this.anims.play(`link-run-west`, true);
            }
            else  if(dx > 0 && mostlyHorizontal) {
                this.anims.play(`link-run-east`, true);
            }
            else if(dy < 0) {
                this.anims.play(`link-run-north`, true);
            }
            else if(dy > 0) {
                this.anims.play(`link-run-south`, true);
            }
        }

        this.setVelocity(this.dir.x, this.dir.y);
    }
}
import { Character } from "./Character";

export class Link extends Character {

    constructor(scene: Phaser.Scene, x: number, y: number, id: number, name: string) {
        super(scene, x, y, id, name, 'link-stand-south');

        this.stateMachine
            .addState("walking", {
                onUpdate: this.onWalkingUpdate
            })
            .setState("walking");
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
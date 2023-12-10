import type { GameObject, Component } from "@natewilcox/nathan-core";

export class KeyboardInputComponent implements Component {

    private go!: Phaser.GameObjects.GameObject & GameObject;

    private leftKey!: Phaser.Input.Keyboard.Key;
    private rightKey!: Phaser.Input.Keyboard.Key;
    private upKey!: Phaser.Input.Keyboard.Key;
    private downKey!: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {

        //bind the controls
        this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        scene.game.events.addListener(Phaser.Core.Events.BLUR, () => {
            console.warn(`browser lost focus at ${new Date()}. try not to do that`)
            scene.input.keyboard.resetKeys();
        });
    }

    init(go: Phaser.GameObjects.GameObject & GameObject) {
        this.go = go;
    }
    
    update(dt: number, t: number) {

        let dx = 0;
        let dy = 0;

        if(this.leftKey.isDown) {
            dx = -1;
        }
        else if(this.rightKey.isDown) {
            dx = 1;
        }
        
        if(this.upKey.isDown) {
            dy = -1;
        }
        else if(this.downKey.isDown) {
            dy = 1;
        } 
        
        this.go.dir.setTo(dx, dy).normalize().scale(this.go.speed);
    }
}

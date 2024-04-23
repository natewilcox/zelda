import '@geckos.io/phaser-on-nodejs';
import Phaser from "phaser";

export class SimulationScene extends Phaser.Scene {

    constructor() {
        super("simulation");
    }

    preload() {

    }

    create() {
        console.log("simulation started..."); 
    }


    update(time: number, delta: number): void {
    }
}
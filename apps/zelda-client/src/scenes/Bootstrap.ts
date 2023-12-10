import * as Nathan from "@natewilcox/phaser-nathan"
import { createLinkAnimations } from "../animations/LinkAnimations";
import 'dotenv/config'
import { RoomState } from "../types/RoomState";
import { Messages } from "../types/Messages";

export class Bootstrap extends Phaser.Scene{

    private SERVER: Nathan.ServerService<RoomState, Messages>;

    constructor () {
        super('bootstrap');

        const url = `${process.env.HOST}`;
        console.log(`Connecting to: ${url}`);
        
        this.SERVER = new Nathan.ServerService(url);
    }

    preload () {

        this.load.tilemapTiledJSON("sample", "maps/sample.json");
        this.load.image("ground_tiles", "images/tilesets/ground-extruded.png");
        this.load.image("fog", "images/fog.png");

        this.load.atlas("link", "characters/link.png", "characters/link.json");
    }

    create () {
        
        //create animations
        createLinkAnimations(this.anims);

        //start game when resources are loaded and ready
        this.scene.launch('game', {
            SERVER: this.SERVER
        });

        this.scene.launch('hud');
    }
}
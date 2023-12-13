import 'phaser';
import * as Nathan from '@natewilcox/phaser-nathan';
import { animateFog, createGameFog, createGameMap } from '../utils/MapUtils';
import { createPlayer } from '../utils/PlayerUtils';
import { KeyboardInputComponent } from '../components/KeyboardInputComponent';
import { Link } from '../characters/Link';
import { IRoomState, ClientMessages } from '@natewilcox/zelda-shared';
import { ComponentService } from '@natewilcox/nathan-core';
import { SceneEvents } from '../utils/SceneEvents';

export class GameScene extends Nathan.Scene {
 
    SERVER: Nathan.ServerService<IRoomState, ClientMessages>;

    animatedTiles: any;
    map: Phaser.Tilemaps.Tilemap;
    fog: { scrollX: number, scrollY: number, ratioX: number, ratioY: number, sprite: Phaser.GameObjects.TileSprite };
    
    link: Link;
    
    sceneComponents: ComponentService = new ComponentService();;

    constructor () {
        super('game');
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', 'js/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    async create(config?: any) { 

        super.create();
        Nathan.resizeToScreen(this, true, 800, 800);

        this.SERVER = config.SERVER;

        this.map = createGameMap(this, "sample");
        this.fog = createGameFog(this, this.map);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.link = createPlayer(this, 'link', 300, 300, 'link-stand-south');

        this.cameras.main.startFollow(this.link);
        this.cameras.main.setZoom(2);
        this.sceneComponents.addComponent(this.link, new KeyboardInputComponent(this));

        const roomName = 'zelda_room';

        try {
            console.log(`joining ${roomName}`);
            const room = await this.SERVER.connect(roomName);

            SceneEvents.emit('onstatechange', {
                name: room.id
            });

            //ping server
            console.log("pinging server...");
            this.SERVER.send(ClientMessages.SendMessage, {
                msg: "Hi! I'm a client!"
            });

            this.SERVER.on(ClientMessages.SendMessage, (message) => {
                console.log("received message from server", message);

                SceneEvents.emit('onstatechange', {
                    name: "Connection established!"
                });
            });
        }
        catch(e) {
            console.error(`unable to join ${roomName}. Returning to lobby`, e);
        }
    }

    update(dt: number, t: number) {

        if(this.link) {
            this.link.update(dt);
        }

        this.sceneComponents.update(dt, t);
        animateFog(this, this.fog);
    }
}
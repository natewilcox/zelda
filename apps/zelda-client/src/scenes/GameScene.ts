import 'phaser';
import * as Nathan from '@natewilcox/phaser-nathan';
import { animateFog, createGameFog, createGameMap } from '../utils/MapUtils';
import { configureResize } from '../utils/SceneUtils';
import { createPlayer } from '../utils/PlayerUtils';
import KeyboardInputComponent from '../components/KeyboardInputComponent';
import { Link } from '../characters/Link';
import { SceneEvents } from '../utils/SceneEvents';
import { RoomState, ClientMessages } from '@natewilcox/zelda-shared';

export class GameScene extends Nathan.Scene {
 
    SERVER: Nathan.ServerService<RoomState, ClientMessages>;

    animatedTiles: any;
    map: Phaser.Tilemaps.Tilemap;
    fog: { scrollX: number, scrollY: number, ratioX: number, ratioY: number, sprite: Phaser.GameObjects.TileSprite };
    
    link: Link;
    
    sceneComponents: Nathan.ComponentService = new Nathan.ComponentService();;

    constructor () {
        super('game');
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', 'js/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    async create(config: any) { 

        this.SERVER = config.SERVER;

        configureResize(this);

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
import 'phaser';
import * as Nathan from '@natewilcox/phaser-nathan';
import { animateFog, createGameFog, createGameMap } from '../utils/MapUtils';
import { createPlayer } from '../utils/PlayerUtils';
import { KeyboardInputComponent } from '../components/KeyboardInputComponent';
import { Link } from '../characters/Link';
import { IRoomState, ClientMessages, IPlayerState } from '@natewilcox/zelda-shared';
import { ComponentService } from '@natewilcox/nathan-core';
import { SceneEvents } from '../utils/SceneEvents';

export class GameScene extends Nathan.Scene {
 
    SERVER: Nathan.ServerService<IRoomState, ClientMessages>;

    animatedTiles: any;
    map: Phaser.Tilemaps.Tilemap;
    fog: { scrollX: number, scrollY: number, ratioX: number, ratioY: number, sprite: Phaser.GameObjects.TileSprite };
    
    playersList: Link[] = [];
    playerMap: Map<string, Link> = new Map();

    sceneComponents: ComponentService = new ComponentService();

    constructor () {
        super('game');
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', 'js/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    async create(config?: any) { 
        super.create();
        this.SERVER = config.SERVER;

        //configure scene to resize to screen and zoom in
        Nathan.resizeToScreen(this, true, 800, 800);
        this.cameras.main.setZoom(2);

        //configure map and join room
        this.configureMap();
        await this.tryJoinRoom();
    }

    update(dt: number, t: number) {

        this.playersList.forEach(player => player.update(dt));

        this.sceneComponents.update(dt, t);
        animateFog(this, this.fog);
    }

    private flashMessage = (message: string) => {

        SceneEvents.emit('onstatechange', {
            name: message
        });

        this.time.delayedCall(2000, () => {
            console.log('clearing message');
            SceneEvents.emit('onstatechange', {
                name: ' '
            });
        });
    }

    private configureMap() {

        this.map = createGameMap(this, "sample");
        this.fog = createGameFog(this, this.map);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    private addPlayer = (playerState: IPlayerState) => {

        const { id, clientId, x, y } = playerState;
        console.log('player joined', id, clientId, x, y);
        
        const link = createPlayer(this, 'link', x, y, 'link-stand-south');

        //add the player to the list and map
        this.playersList.push(link);
        this.playerMap.set(clientId, link);

        //if the player is us, follow them
        if(clientId == this.SERVER.SessionID) {

            console.log('following player');
            this.cameras.main.startFollow(link);
            this.sceneComponents.addComponent(link, new KeyboardInputComponent(this));
        }

        this.flashMessage(`player-${clientId}-joined`);
    }

    private removePlayer = (playerState: IPlayerState) => {
            
        const { id, clientId } = playerState;
        console.log('player left', id, clientId);
        
        const player = this.playerMap.get(clientId);

        if(player) {

            console.log('destroying player');
            player.destroy();

            this.playersList.splice(this.playersList.indexOf(player), 1);
            this.playerMap.delete(clientId);

            this.flashMessage(`player-${clientId}-left`);
        }
    }

    private async tryJoinRoom() {

        const roomName = 'zelda_room';

        try {
            console.log(`joining ${roomName}`);
            const room = await this.SERVER.connect(roomName);
            console.log(`joined ${roomName}`);

            const roomState: IRoomState = room.state;
            roomState.players.onAdd(this.addPlayer);
            roomState.players.onRemove(this.removePlayer);
        }
        catch(e) {
            console.error(`unable to join ${roomName}. Returning to lobby`, e);
        }
    }
}
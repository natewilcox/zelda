import 'phaser';
import * as Nathan from '@natewilcox/phaser-nathan';
import { animateFog, createGameFog, createGameMap } from '../utils/MapUtils';
import { createPlayer } from '../utils/PlayerUtils';
import { KeyboardInputComponent } from '../components/KeyboardInputComponent';
import { Link } from '../characters/Link';
import { IRoomState, ClientMessages, IPlayerState } from '@natewilcox/zelda-shared';
import { ComponentService } from '@natewilcox/nathan-core';
import { SceneEvents } from '../utils/SceneEvents';
import { ServerControlledComponent } from '../components/ServerControlledComponent';
import { PatchServerComponent } from '../components/PatchServerComponent';

export class GameScene extends Nathan.Scene {
 
    SERVER: Nathan.ServerService<IRoomState, ClientMessages>;

    animatedTiles: any;
    map: Phaser.Tilemaps.Tilemap;
    fog: { scrollX: number, scrollY: number, ratioX: number, ratioY: number, sprite: Phaser.GameObjects.TileSprite };
    
    state: IRoomState;
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

        this.configureMap();

        //join the room and listen for player changes
        this.state = await this.tryJoinRoom('zelda_room');
        this.state.players.onAdd(this.addPlayer);
        this.state.players.onRemove(this.removePlayer);
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

        const { clientId } = playerState;
        console.log('player joined', clientId);

        const player = createPlayer(this, playerState);
 
        //add the player to the list and map
        this.playersList.push(player);
        this.playerMap.set(clientId, player);

        //check if this player is me
        if(clientId == this.SERVER.SessionID) {

            //follow me and give me keyboard control
            console.log('following player', player.id);
            this.cameras.main.startFollow(player);
            this.sceneComponents.addComponent(player, new KeyboardInputComponent(this));
            this.sceneComponents.addComponent(player, new PatchServerComponent(this, 1));
        }
        else {

            //control this player from the server
            this.sceneComponents.addComponent(player, new ServerControlledComponent(this));
        }

        this.flashMessage(`player-${clientId}-joined`);
    }

    private removePlayer = (playerState: IPlayerState) => {
            
        const { id, clientId } = playerState;
        console.log('player left', id, clientId);
        
        const player = this.playerMap.get(clientId);

        if(player) {

            console.log('destroying player', player.id);
            player.destroy();

            this.playersList.splice(this.playersList.indexOf(player), 1);
            this.playerMap.delete(clientId);
            this.sceneComponents.destroyComponents(player);
            
            this.flashMessage(`player-${clientId}-left`);
        }
    }

    private async tryJoinRoom(roomName: string) {

        try {
            console.log(`joining ${roomName}`);
            const room = await this.SERVER.connect(roomName);
            console.log(`joined ${roomName}`);

            return room.state;
        }
        catch(e) {
            console.error(`unable to join ${roomName}.`, e);
        }
    }
}
import '@geckos.io/phaser-on-nodejs';
import { ClientMessages, IPlayerState } from '@natewilcox/zelda-shared';
import { Client } from 'colyseus';
import Phaser from "phaser";
import { SimulationEventEmitter, SimulationEvents } from '../utils/SimulationEvents';
import { Dispatcher } from '@colyseus/command';
import { GameRoom } from '../rooms/GameRoom';
import { ComponentService } from '@natewilcox/nathan-core';
import { Player } from '../objects/Player';
import { PatchStateComponent } from '../components/PatchStateComponent';

export class SimulationScene extends Phaser.Scene {

    private room: GameRoom;
    private dispatcher: Dispatcher<GameRoom>;
    private CLIENT: any;

    //group of player sprites
    private players: Phaser.Physics.Arcade.Group;
    playerMap: Map<string, Player> = new Map();
    
    sceneComponents: ComponentService = new ComponentService();
    
    constructor() {
        super("simulation");
    }

    preload() {

    }

    create(config: any) {

        this.players = this.physics.add.group({
            classType: Player
        });

        this.room = config.room;
        this.dispatcher = config.dispatcher;
        this.CLIENT = config.CLIENT;

        //listen for client messages
        console.log("Listening for client messages.");
        this.CLIENT.on(ClientMessages.PatchPlayerState, this.onPlayerPatch);

        SimulationEventEmitter.on(SimulationEvents.PlayerJoined, this.addPlayer);
        SimulationEventEmitter.on(SimulationEvents.PlayerLeft, this.removePlayer);
    }

    update(t: number, dt: number): void {

        //this.playersList.forEach(player => player.update(dt));
        this.sceneComponents.update(dt, t);
    }

    onPlayerPatch = (client: Client, patch: any) => {  

        const player = this.playerMap.get(client.id);
        
        if(player) {
            
            //if position is patched, move the player
            if(patch.x && patch.y) {
                player.moveTowards(patch.x, patch.y);
            }
            else {
                player.stopMoving()
            }
        }
    }

    addPlayer = (playerState: IPlayerState) => {

        const { clientId, id } = playerState;
        console.log(`adding player to simulation: ${clientId}-${id}`);

        //get a new player added to the group
        const player = this.players.get(playerState.x, playerState.y, 'link') as Player;
        player.id = id;
        player.playerState = playerState;

        this.playerMap.set(clientId, player);

        console.log(`player added to group: ${player.id} at ${player.x}, ${player.y}`);

        this.sceneComponents.addComponent(player, new PatchStateComponent(this));

        console.log(`player ${id} was added to the simulation`);
    }

    removePlayer = (playerState: IPlayerState) => {
 
        const { id, clientId } = playerState;
        console.log(`removing player from simulation: ${clientId}-${id}`);
        
        const player = this.playerMap.get(clientId);

        if(player) {

            console.log(`destroying player object for ${clientId}-${id}`)
            player.destroy();

            this.playerMap.delete(clientId);
            this.sceneComponents.destroyComponents(player);

            console.log(`player ${clientId}-${id} was removed from the simulation`);
        }
    }
}
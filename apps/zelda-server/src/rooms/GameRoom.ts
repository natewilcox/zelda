import { Room, Client } from "@colyseus/core";
import { GameRoomState } from "./schema/GameRoomState";
import { SimulationScene } from "../scenes/SimulationScene";
import { JoinCommand } from "../commands/JoinCommand";
import { LeaveCommand } from "../commands/LeaveCommand";
import { Dispatcher } from "@colyseus/command";
import { ClientMessages } from "@natewilcox/zelda-shared";
import { ClientService } from "@natewilcox/colyseus-nathan";
import { SimulationEventEmitter } from "../utils/SimulationEvents";

export class GameRoom extends Room<GameRoomState> {

    simulation: Phaser.Game;
    dispatcher: Dispatcher<GameRoom> = new Dispatcher(this);
    CLIENT: ClientService<ClientMessages>;
    
    maxClients = 4;
    PATCH = 20;
    FPS = 20;

    onCreate () {
        console.info("Room created");

        this.CLIENT = new ClientService(this);
        this.configureRoom();

        //create a new simulation
        this.simulation = this.createSimulation(); 
        
        //start the simulation
        console.log(`starting simulation...`);
        this.simulation.scene.add('simulation', SimulationScene, true, { 
            room: this, 
            dispatcher: this.dispatcher,
            CLIENT: this.CLIENT 
        }); 

        console.log(`simulation started`);
    }

    onJoin (client: Client, options: any) {
        console.log(client.sessionId, "joined!");

        //join with random x and y between 0 and 800
        this.dispatcher.dispatch(new JoinCommand(), {
            client,
            x: Math.floor(Math.random() * 800),
            y: Math.floor(Math.random() * 600)
        });
    }

    onLeave (client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
        this.dispatcher.dispatch(new LeaveCommand(), {
            client
        });
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
        
        SimulationEventEmitter.removeAllListeners();

        //stop the simulation and destroy it
        this.simulation.destroy(false);
        this.simulation = null;

        console.log(`simulation destroyed`);
    }

    private configureRoom() {
        this.setPatchRate(1000/this.PATCH);
        this.setState(new GameRoomState());
    }

    private createSimulation() {

        (global as any).phaserOnNodeFPS = this.FPS;

        const config = {
            type: Phaser.HEADLESS,
            width: 800,
            height: 600,
            fps: {
                target: this.FPS,
                forceSetTimeOut: true
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0, x: 0 }
                }
            }
        }

        const simulation = new Phaser.Game(config); 
        return simulation;
    }
}

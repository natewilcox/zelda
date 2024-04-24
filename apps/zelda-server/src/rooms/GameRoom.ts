import { Room, Client } from "@colyseus/core";
import { GameRoomState } from "./schema/GameRoomState";
import { SimulationScene } from "../scenes/SimulationScene";
import { JoinCommand } from "../commands/JoinCommand";
import { LeaveCommand } from "../commands/LeaveCommand";
import { Dispatcher } from "@colyseus/command";
import { ClientMessages } from "@natewilcox/zelda-shared";
import { ClientService } from "@natewilcox/colyseus-nathan";
import { PatchPlayerStateCommand } from "../commands/PatchPlayerStateCommand";

export class GameRoom extends Room<GameRoomState> {

    game: Phaser.Game;
    maxClients = 4;
    dispatcher: Dispatcher<GameRoom> = new Dispatcher(this);
    CLIENT: ClientService<ClientMessages>;
    
    onCreate () {
        console.info("Room created");
  
        const PATCH = 20;
        const FPS = 30;

        (global as any).phaserOnNodeFPS = FPS;

        this.setPatchRate(1000/PATCH);
        this.setState(new GameRoomState());

        const config = {
            type: Phaser.HEADLESS,
            width: 800,
            height: 600,
            fps: {
                target: FPS,
                forceSetTimeOut: true
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0, x: 0 }
                }
            }
        }

        console.log("Starting simluation scene");

        this.game = new Phaser.Game(config);
        this.game.scene.add('SimulationScene', SimulationScene, true);   

        this.CLIENT = new ClientService(this);

        console.log("Listening for client messages.");
        
        console.log("ClientMessages.PatchPlayerState", ClientMessages.PatchPlayerState);
        this.CLIENT.on(ClientMessages.PatchPlayerState, this.onPlayerPatch);
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
        this.game.destroy(false);
    }
    
    onPlayerPatch = (client: Client, patch: any) => {

        this.dispatcher.dispatch(new PatchPlayerStateCommand(), {
            client, 
            patch
        });
    }
}

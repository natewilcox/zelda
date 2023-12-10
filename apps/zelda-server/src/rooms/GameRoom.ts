import { Room, Client } from "@colyseus/core";
import { GameRoomState } from "./schema/GameRoomState";
import { SimulationScene } from "../scenes/SimulationScene";
import { JoinCommand } from "../commands/JoinCommand";
import { LeaveCommand } from "../commands/LeaveCommand";
import { Dispatcher } from "@colyseus/command";

export class GameRoom extends Room<GameRoomState> {

    game: Phaser.Game;
    maxClients = 4;
    dispatcher: Dispatcher<GameRoom> = new Dispatcher(this);

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

    }

    onJoin (client: Client, options: any) {
        console.log(client.sessionId, "joined!");
        this.dispatcher.dispatch(new JoinCommand(), {
            client,
            x: 0,
            y: 0
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
}

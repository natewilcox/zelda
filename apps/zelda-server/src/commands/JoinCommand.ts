import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { PlayerState } from "../rooms/schema/PlayerState";
import { SimulationEventEmitter, SimulationEvents } from "../utils/SimulationEvents";

type Payload = {
    client: any,
    x: number,
    y: number
};

let id_index = 0;

export class JoinCommand extends Command<GameRoom, Payload> {

    async execute({ client, x, y }: Payload) {

        console.log("JoinCommand executed");

        //create a new player state for the client
        const playerState = new PlayerState(++id_index, client.id, x, y);

        //add the player to the room state
        this.state.players.push(playerState);

        SimulationEventEmitter.emit(SimulationEvents.PlayerJoined, playerState);
    }
}
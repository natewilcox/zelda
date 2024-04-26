import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { SimulationEventEmitter, SimulationEvents } from "../utils/SimulationEvents";

type Payload = {
    client: any
};

export class LeaveCommand extends Command<GameRoom, Payload> {

    async execute({ client }: Payload) {

        console.log("LeaveCommand executed");

        //remove the player from the room state
        const index = this.state.players.findIndex(p => p.clientId == client.id);
        const player = this.state.players.find(p => p.clientId == client.id);

        SimulationEventEmitter.emit(SimulationEvents.PlayerLeft, player);
        
        if (player) {
            this.state.players.splice(index, 1);
        }
    }
}
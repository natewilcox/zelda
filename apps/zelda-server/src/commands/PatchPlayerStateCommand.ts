import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";

type Payload = {
    client: any,
    patch: any
};

export class PatchPlayerStateCommand extends Command<GameRoom, Payload> {

    async execute({ client, patch }: Payload) {

        //find the player by client id
        const player = this.state.players.find(p => p.clientId == client.id);

        if (player) {

            console.log(`patching player ${player.id}`, patch);
            
            //apply the patch to the player state
            if(patch.x) player.x = patch.x;
            if(patch.y) player.y = patch.y;
        }
    }
}
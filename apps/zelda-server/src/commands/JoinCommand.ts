import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";

type Payload = {
    client: any,
    x: number,
    y: number
};

export class JoinCommand extends Command<GameRoom, Payload> {

    async execute({ client, x, y }: Payload) {

        console.log("JoinCommand executed");
    }
}
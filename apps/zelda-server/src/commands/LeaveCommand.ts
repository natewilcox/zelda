import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";

type Payload = {
    client: any
};

export class LeaveCommand extends Command<GameRoom, Payload> {

    async execute({ client }: Payload) {

        console.log("LeaveCommand executed");
    }
}
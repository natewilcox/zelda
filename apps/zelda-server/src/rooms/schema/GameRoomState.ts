import { ArraySchema, Schema, type } from "@colyseus/schema";
import { ServerObjectState } from "./PlayerState";

export class GameRoomState extends Schema {

    @type([ServerObjectState])
    serverObjects = new ArraySchema<ServerObjectState>();
}

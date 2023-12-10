import { ArraySchema, Schema, type } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";
import { IRoomState } from "@natewilcox/zelda-shared";

export class GameRoomState extends Schema implements IRoomState {

    @type([PlayerState])
    players = new ArraySchema<PlayerState>();
}

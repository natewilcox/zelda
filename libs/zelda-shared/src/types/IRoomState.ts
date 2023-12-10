import { ArraySchema, Schema } from "@colyseus/schema";
import { IPlayerState } from "./IPlayerState";

export interface IRoomState extends Schema {

    players: ArraySchema<IPlayerState>;
}
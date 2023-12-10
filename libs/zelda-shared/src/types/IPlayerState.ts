import type { Schema } from "@colyseus/schema";

export interface IPlayerState extends Schema {

    id: number;
    x: number;
    y: number;
}
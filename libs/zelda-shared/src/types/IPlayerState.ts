import type { Schema } from "@colyseus/schema";

export interface IPlayerState extends Schema {

    id: number;
    clientId: string;
    x: number;
    y: number;
}
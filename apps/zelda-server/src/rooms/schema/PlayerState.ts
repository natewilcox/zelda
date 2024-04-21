import { Schema, type } from "@colyseus/schema";
import { IPlayerState } from "@natewilcox/zelda-shared";

export class PlayerState extends Schema implements IPlayerState {
  
  @type('number')
  id: number;

  @type('string')
  clientId: string;

  @type('number')
  x: number;

  @type('number')
  y: number;

  constructor(id: number, clientId: string, x: number, y: number) {
    super();
    
    this.id = id;
    this.clientId = clientId;
    this.x = x;
    this.y = y;
  }
}
import { Schema, type } from "@colyseus/schema";

export class ServerObjectState extends Schema {
  
  @type('number')
  id: number;

  @type('number')
  x: number;

  @type('number')
  y: number;

  constructor(id: number, x: number, y: number) {
    super();
    
    this.id = id;
    this.x = x;
    this.y = y;
  }
}
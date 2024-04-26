export const SimulationEventEmitter = new Phaser.Events.EventEmitter();

export enum SimulationEvents {
    PlayerJoined = 'playerJoined',
    PlayerLeft = 'playerLeft'
}
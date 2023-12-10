import * as Nathan from "@natewilcox/phaser-nathan";
import { SceneEvents } from "../utils/SceneEvents";

export class HUD extends Nathan.Scene {

    private handle: Phaser.GameObjects.Text;

	constructor() {
        super('hud');
    }

    preload() {
    }

    create() {

        SceneEvents.on('onstatechange', this.handleStatechange, this);
        
        //remove event handlers when scene is shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            SceneEvents.off('onstatechange', this.handleStatechange, this);
        });  
    }

    handleStatechange({ name } : { name: string }) {

        if(this.handle) {
            this.handle.destroy();
        }
        
        this.handle = this.add.text(0, 0, name, { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
    }
}

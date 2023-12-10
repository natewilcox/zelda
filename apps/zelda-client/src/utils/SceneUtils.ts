import { GameScene } from "../scenes/GameScene";

export function configureResize(scene: GameScene) {

    const resize = () => {
        scene.setScreenSize(Math.min(800, window.screen.width), Math.min(800, window.screen.height));
    }

    window.addEventListener('resize', resize);
    resize();
}
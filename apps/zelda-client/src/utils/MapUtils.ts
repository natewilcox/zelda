import { GameScene } from "../scenes/GameScene";

export function createGameMap(scene: GameScene, key: string) {

    const map = scene.make.tilemap({ key: "sample" });
    const ground_tileset = map.addTilesetImage("ground_tiles", "ground_tiles", 8, 8, 1, 3);
    const ground_layer = map.createLayer("ground", ["ground_tiles"]);

    scene.animatedTiles.init(map);
    return map;
}

export function createGameFog(scene: GameScene, map: Phaser.Tilemaps.Tilemap) {

    const width = map.widthInPixels;
    const height = map.heightInPixels;

    console.log(width, height)
    const fog: { scrollX: number, scrollY: number, ratioX: number, ratioY: number, sprite: Phaser.GameObjects.TileSprite } = {
        scrollX: 0,
        scrollY: 0,
        ratioX: .6,
        ratioY: .6,
        sprite: scene.add.tileSprite(0, 0, width, height, "fog")
            .setOrigin(0, 0)
            .setScrollFactor(0, 0)
            .setAlpha(0.25)
            .setDepth(1000)
            .setScale(2)
    }

    return fog;
}

export function animateFog(scene: GameScene, fog: { scrollX: number, scrollY: number, ratioX: number, ratioY: number, sprite: Phaser.GameObjects.TileSprite }) {

    fog.sprite.tilePositionX = scene.cameras.main.scrollX * fog.ratioX + (fog.scrollX += .05 * fog.ratioX);
    fog.sprite.tilePositionY = scene.cameras.main.scrollY * fog.ratioY + (fog.scrollY += .025 * fog.ratioY);
}
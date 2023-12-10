
export const createLinkAnimations = (anims: Phaser.Animations.AnimationManager) => {

    anims.create({ key: `link-stand-south`, frames: [{ key: "link", frame: 'link_stand_down/link_1.png' }], repeat: -1 });
    anims.create({ key: `link-stand-north`, frames: [{ key: "link", frame: 'link_stand_up/link_1.png' }], repeat: -1 });
    anims.create({ key: `link-stand-west`, frames: [{ key: "link", frame: 'link_stand_left/link_1.png' }], repeat: -1 });
    anims.create({ key: `link-stand-east`, frames: [{ key: "link", frame: 'link_stand_right/link_1.png' }], repeat: -1 });

    anims.create({
        key: `link-run-south`, 
        frames: anims.generateFrameNames('link', {start: 1, end: 9, prefix: 'link_walk_down/link_', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `link-run-north`, 
        frames: anims.generateFrameNames('link', {start: 1, end: 9, prefix: 'link_walk_up/link_', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `link-run-west`, 
        frames: anims.generateFrameNames('link', {start: 1, end: 8, prefix: 'link_walk_left/link_', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `link-run-east`, 
        frames: anims.generateFrameNames('link', {start: 1, end: 8, prefix: 'link_walk_right/link_', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });
}
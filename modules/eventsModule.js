import { game, keys, Projectiles, soundsEffect, player, soundIcon} from "../index.js";
import { Projectile } from "./classesModule.js";

export let isBackgroundSoundMuted = false;

let spaceKeyPressed = false;

export const handleKeyDown = (event) => {
    if (game.over) return;

    const { code } = event;

    switch (code) {
        case "KeyA":
            keys.a.pressed = true;
            break;
        case "KeyD":
            keys.d.pressed = true;
            break;
        case "Space":
            if (!spaceKeyPressed) {
                soundsEffect.playerShootSound.play();
                Projectiles.push(
                    new Projectile({
                        position: {
                            x: player.position.x + player.width / 2,
                            y: player.position.y
                        },
                        velocity: {
                            x: 0,
                            y: -10
                        }
                    })
                );
                spaceKeyPressed = true;
            }
            break;
        case "KeyM":
            const toggleBackgroundSound = () => {
                if (isBackgroundSoundMuted) {
                    soundsEffect.backgroundSound.play();
                } else {
                    soundsEffect.backgroundSound.pause();
                }

                isBackgroundSoundMuted = !isBackgroundSoundMuted;
            };

            toggleBackgroundSound();
            soundIcon.toggleImage();
            break;
    }
};

export const handleKeyUp = (event) => {
    const { code } = event;

    switch (code) {
        case "KeyA":
            keys.a.pressed = false;
            break;
        case "KeyD":
            keys.d.pressed = false;
            break;
        case "Space":
            spaceKeyPressed = false;
            break;
    }
};
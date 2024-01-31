import { canvas, c, invaderBoss, particles, soundsEffect} from "../index.js";
import { Particle, BossParticle} from "./classesModule.js";

const bossMaxHealth = 10000;
let bossCurrentHealth = 10000;



export function fadeInSound() {
    if (soundsEffect.backgroundSound.volume <= 0.5) {
        soundsEffect.backgroundSound.volume += 0.001; 
        requestAnimationFrame(fadeInSound);
    }
}

//create explode obj
export function createParticles({object, color, fades}) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3 || radius,
            color: color || "#BAA0DE",
            fades
        })
      )
    }
}

export function updateHealthBar() {
    drawHealthBar();

}

export function drawHealthBar() {

    const barWidth = canvas.width;
    const barHeight = 20;
    const barX = 0;
    const barY = canvas.height - barHeight;


    const backgroundColor = 'yellow';
    const fillColor = 'red';


    c.fillStyle = backgroundColor;
    c.fillRect(barX, barY, barWidth, barHeight);


    const fillWidth = (bossCurrentHealth / bossMaxHealth) * barWidth;
    c.fillStyle = fillColor;
    c.fillRect(barX, barY, fillWidth, barHeight);

    c.fillStyle = 'blue';
    c.font = '21px Pixelify Sans';
    c.fillText(`Health: ${bossCurrentHealth}/${bossMaxHealth}`, barX + 10, barY + barHeight - 5);

    const centerText = 'GENERAL NIT';
    const textWidth = c.measureText(centerText).width;
    const textX = barX + (barWidth - textWidth) / 2;
    const textY = barY + barHeight / 2 + 5;

    c.fillText(centerText, textX, textY);
}

export function resetBoss() {
    bossCurrentHealth = bossMaxHealth;
    updateHealthBar();
}

export function bossHit() {
    bossCurrentHealth -= 100;
    if (bossCurrentHealth < 0) {
        bossCurrentHealth = 0;
    }

    updateHealthBar();

    if (bossCurrentHealth === 0) {
        resetBoss();
    }
}


export function changeDirection() {
    const randomDirection = Math.random() < 0.5 ? -1 : 1;
    invaderBoss.velocity.x = randomDirection * 2;
    const randomInterval = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

    setTimeout(() => {
        changeDirection();
    }, randomInterval);
}

export function createBossParticles({object, color, fades}) {
    for (let i = 0; i < 150; i++) {
        particles.push(new BossParticle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 1,
                y: (Math.random() - 0.5) * 1
            },
            radius: Math.random() * 5,
            color: color || "#BAA0DE",
            fades
        })
      )
    }
}

// backgroundImgLoop
export const starsLoop = () => {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: 0.7
            },
            radius: Math.random() * 2,
            color: "white"
        })
      )
    }
}

export async function animateScore() {
    const animationStartTime = Date.now();
    const { x, y } = invaderBoss.position;
    const textY = y + 50;

    async function animateText() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - animationStartTime;

        c.fillStyle = `white`;
        c.font = "32px Pixelify Sans";
        c.fillText('+5000', x, textY - (elapsedTime / 55)); // lift animation

        if (elapsedTime < 1000) {
            await new Promise(resolve => requestAnimationFrame(resolve));
            animateText();
        }
    }

    await animateText();
}

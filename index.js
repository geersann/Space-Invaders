import { handleKeyDown, handleKeyUp, isBackgroundSoundMuted } from "./modules/eventsModule.js";
import { StartBackground, SoundIcon, Player, 
    Projectile, Particle, InvaderProjectile,
    Invader, Grid} from "./modules/classesModule.js";
import { frames, score, StartButton, animate, randomInterval,
    saveScore, loadScore, createParticles} from "./modules/animationModule.js";

export const scoreEl = document.querySelector("#scoreEl");
export const overscoreEl = document.querySelector("#overscoreEl")
export const scoreTab = document.querySelector(".score-tab");
export const overScore = document.querySelector(".over-score");
export const overTitle = document.querySelector(".over-title");
export const menuButton = document.querySelector(".menu-button");
export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d")
canvas.width = 1500
canvas.height = 867

export const startButton = new StartButton();
export const isActive = (obj) => obj.isActive;
export const player = new Player()
export const grid = new Grid();
export const background = new StartBackground();
background.draw()
export const soundIcon = new SoundIcon();
soundIcon.draw()
startButton.draw()
export const Projectiles = [];
export const grids = [];
export const invaderProjectiles = [];
export const particles = [];
export const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
}

export let game = {
    over: true,
    active: true,
}

export const soundsEffect = {
    playerShootSound: new Audio("./sounds/shoot.wav"),
    explodeSound: new Audio("./sounds/explode.wav"),
    enemyShootSound: new Audio("./sounds/enemyShoot.wav"),
    gameOverSound: new Audio("./sounds/gameOver.mp3"),
    gameStartSound: new Audio("./sounds/start.mp3"),
    selectSound: new Audio("./sounds/select.mp3"),
    backgroundSound: new Audio("./sounds/backgroundMusic.wav")
};

soundsEffect.playerShootSound.volume = 0.1;
soundsEffect.explodeSound.volume = 0.3;
soundsEffect.enemyShootSound.volume = 0.2;
soundsEffect.gameOverSound.volume = 0.1;
soundsEffect.gameStartSound.volume = 0.1;
soundsEffect.selectSound.volume = 0.1;
soundsEffect.backgroundSound.volume = 0.5;

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

loadScore();
animate();

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
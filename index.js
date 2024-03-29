import { handleKeyDown, handleKeyUp,} from "./modules/eventsModule.js";
import { StartBackground, SoundIcon, Player, Grid, InvaderBoss} from "./modules/classesModule.js";
import { StartButton, animate, loadScore} from "./modules/animationModule.js";
import { starsLoop } from "./modules/funcModule.js";

export const scoreEl = document.querySelector("#scoreEl");
export const overscoreEl = document.querySelector("#overscoreEl")
export const newRecordEl = document.querySelector("#newRecordEl")
export const scoreTab = document.querySelector(".score-tab");
export const overScore = document.querySelector(".over-score");
export const overNewRecord = document.querySelector(".over-new-record");
export const overTitle = document.querySelector(".over-title");
export const menuButton = document.querySelector(".menu-button");
export const victoryTitle = document.querySelector(".victory-title");
export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d")
canvas.width = 1000
canvas.height = 569



export const startButton = new StartButton();
export const isActive = (obj) => obj.isActive;
export const player = new Player();
export const invaderBoss = new InvaderBoss();
export const grid = new Grid();
export const background = new StartBackground();
export const soundIcon = new SoundIcon();
export const Projectiles = [];
export const grids = [];
export const invaderProjectiles = [];
export const bossProjectiles = [];
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
    backgroundSound: new Audio("./sounds/backgroundMusic.wav"),
    bossStartFight: new Audio("./sounds/bossFightStart.ogg"),
    bossFightEpic: new Audio("./sounds/bossFightEpic.ogg"),
    bossGameover: new Audio("./sounds/bossGameOver.ogg"),
    bossVictory: new Audio("./sounds/bossVictory.ogg"),
};

soundsEffect.playerShootSound.volume = 0.1;
soundsEffect.explodeSound.volume = 0.3;
soundsEffect.enemyShootSound.volume = 0.2;
soundsEffect.gameOverSound.volume = 0.1;
soundsEffect.gameStartSound.volume = 0.1;
soundsEffect.selectSound.volume = 0.1;
soundsEffect.backgroundSound.volume = 0.5;
soundsEffect.bossStartFight.volume = 0.5;
soundsEffect.bossFightEpic.volume = 0.5;
soundsEffect.bossGameover.volume = 0.5;
soundsEffect.bossVictory.volume = 0.5;

background.draw()
soundIcon.draw()
startButton.draw()
starsLoop();
loadScore();
animate();

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
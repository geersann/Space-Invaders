// import {helper} from './modules/funcModule.js';
import { animate, createParticles, toggleBackgroundSound} from './animateModule.js';

export const scoreEl = document.querySelector("#scoreEl");
export const overscoreEl = document.querySelector("#overscoreEl")
export const scoreTab = document.querySelector(".score-tab");
export const overScore = document.querySelector(".over-score");
export const overTitle = document.querySelector(".over-title");
export const menuButton = document.querySelector(".menu-button");
export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d")
export let score = 0;

canvas.width = 1500
canvas.height = 867

const soundsEffect = {
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

class StartButton {
    constructor() {
        this.position = {
            x: 610,
            y: 570
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.drawActive = true;
        this.textElement = document.querySelectorAll(".intro");

        const image = new Image();
        image.src = "./img/button.png";
        image.onload = () => {
            this.image = image;
            this.width = image.width / 0.5;
            this.height = image.height / 0.5;

            this.handleCanvasClick = this.handleCanvasClick.bind(this);
            this.handleGameOverClick = this.handleGameOverClick.bind(this);
            this.addEventListeners();
        };
    }

    addEventListeners() {
        canvas.addEventListener("click", this.handleCanvasClick);
    }

    handleCanvasClick(event) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        if (
            mouseX >= this.position.x &&
            mouseX <= this.position.x + this.width &&
            mouseY >= this.position.y &&
            mouseY <= this.position.y + this.height
        ) {
            this.animateBackground();
            soundsEffect.selectSound.play();
            this.drawActive = false;
            background.drawActive = false;

            if (this.textElement) {
                this.textElement.forEach(element => {
                    element.classList.add("hidden");
                });
            }

            canvas.removeEventListener("click", this.handleCanvasClick);
            canvas.addEventListener("click", this.handleGameOverClick);
        }
    }

    handleGameOverClick(event) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        if (
            mouseX >= this.position.x &&
            mouseX <= this.position.x + this.width &&
            mouseY >= this.position.y &&
            mouseY <= this.position.y + this.height
        ) {
            location.reload();
        }
    }

    animateBackground() {
        setTimeout(() => {
            soundsEffect.gameStartSound.play();
        }, 300);
        setTimeout(() => {
            soundsEffect.backgroundSound.play();
        }, 500)
        player.opacity = 1;
        game.over = false;
        frames = 0;
        score = 0;

        const scoreTab = document.querySelector(".score-tab");
        scoreTab.classList.toggle("active");
    }

    draw() {
        if (this.drawActive && this.image) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }
    }
}

class StartBackground {
    constructor() {
        this.position = {
            x: 230,
            y: 200
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.drawActive = true;

        const image = new Image();
        image.src = "./img/startScreenBackground.png";
        image.onload = () => {
            this.image = image;
            this.width = image.width / 0.7;
            this.height = image.height / 0.7;
        };
    }

    draw() {
        if (this.drawActive && this.image) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }
    }
}
class SoundIcon {
    constructor() {
        this.position = {
            x: 0,
            y: 50
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.muted = true;

        this.image1 = new Image();
        this.image1.src = "./img/soundIcon.jpg";
        this.image1.onload = () => {
            this.width = this.image1.width / 0.7;
            this.height = this.image1.height / 0.7;
        };

        this.image2 = new Image();
        this.image2.src = "./img/muteIcon.jpg";

        this.currentImage = this.image1;
    }

    toggleImage() {
        this.currentImage = (this.currentImage === this.image1) ? this.image2 : this.image1;

        this.width = this.currentImage.width / 0.7;
        this.height = this.currentImage.height / 0.7;
    }

    draw() {
        if (this.currentImage)
            c.drawImage(
                this.currentImage,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
    }
}

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 0

        const image = new Image()
        image.src = "./img/spaceship.png"
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale 
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        // c.fillStyle = "red"
        // c.fillRect(this.position.x, this.position.y, this.width,
        //      this.height)

        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            player.position.x +player.width / 2, 
            player.position.y + player.height / 2
        )
        c.rotate(this.rotation)
        
        c.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
        )

        c.drawImage(
            this.image,
            this.position.x, 
            this.position.y,
            this.width, 
            this.height
        )
        c.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 4
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 
            Math.PI * 2)
        c.fillStyle = "red"
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 
            Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.fades) this.opacity -= 0.01
    }
}

class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }
    draw() {
       c.fillStyle = "white"
       c.fillRect(this.position.x, this.position.y, this.width,
        this.height) 
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

export class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = "./img/invader.png"
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale 
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        // c.fillStyle = "red"
        // c.fillRect(this.position.x, this.position.y, this.width,
        //      this.height)

        c.drawImage(
            this.image,
            this.position.x, 
            this.position.y,
            this.width, 
            this.height
        )
    }
    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles) {
       invaderProjectiles.push(new InvaderProjectile({
        position: {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height 
        },
        velocity: {
           x: 0,
           y: 3 
        }
       }))
    }
}

export class Grid {
    constructor() {
        this.isActive = true;

        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = [];

        const columns = Math.floor(Math.random() * 10 + 5);
        const rows = Math.floor(Math.random() * 5 + 2);

        this.width = columns * 30;

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 30,
                            y: y * 30
                        }
                    })
                );
            }
        }
    }

    update() {
        if (!this.isActive) {
            return;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
        }
    }
}

export let isBackgroundSoundMuted = false;
export let frames;
export const isActive = (obj) => obj.isActive;
export const player = new Player()
export const grid = new Grid();
export const background = new StartBackground();
background.draw()
export const startButton = new StartButton();
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


export let randomInterval = Math.floor(Math.random() * 500 + 500);
export let game = {
    over: true,
    active: true,
}

const saveScore = () => {
    window.localStorage.setItem("score", score);
}

const loadScore = () => {
    score = parseInt(window.localStorage.getItem("score"), 10) || 0;

    const textElement = document.getElementById("scoreSlide");

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>1</td>
        <td>Player</td>
        <td>${score}</td>
    `;
    textElement.appendChild(newRow);
}
loadScore();

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

// function createParticles({object, color, fades}) {
//     for (let i = 0; i < 15; i++) {
//         particles.push(new Particle({
//             position: {
//                 x: object.position.x + object.width / 2,
//                 y: object.position.y + object.height / 2
//             },
//             velocity: {
//                 x: (Math.random() - 0.5) * 2,
//                 y: (Math.random() - 0.5) * 2
//             },
//             radius: Math.random() * 3,
//             color: color || "#BAA0DE",
//             fades
//         })
//       )
//     }
// }

// function toggleBackgroundSound() {
//     if (isBackgroundSoundMuted) {
//         soundsEffect.backgroundSound.play();
//     } else {
//         soundsEffect.backgroundSound.pause();
//     }

//     isBackgroundSoundMuted = !isBackgroundSoundMuted;
// }

// function animate() {
//     if (!game.active) return
//     requestAnimationFrame(animate)
//     c.fillStyle = "black"
//     let spawnActive = true;
//     c.fillRect(0, 0, canvas.width, canvas.height)
//     background.draw()
//     startButton.draw()
//     soundIcon.draw()
//     player.update()
//     particles.forEach((particle, i) => {

//         if(particle.position.y - particle.radius >= canvas.
//             height) {
//                 particle.position.x = Math.random() * canvas.width
//                 particle.position.y = -particle.radius
//             }

//         if(particle.opacity <= 0) {
//             setTimeout(() => {
//                 particles.splice(i, 1)
//             }, 0)
//         } else {
//             particle.update();
//         }
//     })
    
//     invaderProjectiles.forEach((InvaderProjectile, index) => {
//         if(InvaderProjectile.position.y + InvaderProjectile.
//             height >= canvas.height) {
//                 setTimeout(() => {
//                     invaderProjectiles.splice(index, 1)
//                 }, 0)   
//             } else InvaderProjectile.update()

//             // projectile hits player
//             if (InvaderProjectile.position.y + InvaderProjectile.height 
//                     >= 
//                 player.position.y && InvaderProjectile.position.x +
//                 InvaderProjectile.width 
//                     >= 
//                 player.position.x && 
//                 InvaderProjectile.position.x <= player.position.x +
//                 player.width
//                 ) 
//                 {
//                     soundsEffect.explodeSound.play()
//                     soundsEffect.backgroundSound.muted = !soundsEffect.backgroundSound.muted;
//                     soundsEffect.enemyShootSound.muted = !soundsEffect.enemyShootSound.muted;
//                     soundsEffect.gameOverSound.play()
//                     setTimeout(() => {
//                         invaderProjectiles.splice(index, 1)
//                         player.opacity = 0
//                         game.over = true
//                     }, 0)

//                     setTimeout(() => {
//                         menuButton.classList.toggle("active");
//                         overTitle.classList.toggle("active");
//                         overScore.classList.toggle("active");
//                         scoreTab.classList.remove("active");
//                         grids.forEach((grid) => {
//                             grid.isActive = false;
//                         });
//                         background.drawActive = true;
//                         startButton.drawActive = true;
//                         canvas.addEventListener("click", startButton.handleGameOverClick);
//                         saveScore();
//                     }, 3000);

//                     createParticles({
//                         object: player,
//                         color: "white",
//                         fades: true
//                       }) 
//                 }
//     })

//     Projectiles.forEach((Projectile, index) => {

//         if(Projectile.position.y + Projectile.radius <= 0){
//             setTimeout(() => {
//                 Projectiles.splice(index, 1)
//             }, 0)
//         }else{
//         Projectile.update()
//         }
//     })

//     grids.forEach((grid, gridIndex) => {
//         grid.update()

//         // spawn projectiles
//         if (frames % 199 === 0 && grid.invaders.length > 0) {
//            soundsEffect.enemyShootSound.play();
//            grid.invaders[Math.floor(Math.random() * grid.invaders.
//             length)].shoot(
//                 invaderProjectiles
//                 )
//         }

//           // projectiles hit enemy
//           grid.invaders.forEach((invader, i) => {
//             invader.update({velocity: grid.velocity})
            
//             Projectiles.forEach((Projectile, j)=> {
//                if (
//                 Projectile.position.y - Projectile.radius <= 
//                     invader.position.y + invader.height &&
//                 Projectile.position.x + Projectile.radius >=
//                     invader.position.x && 
//                 Projectile.position.x - Projectile.radius <= 
//                     invader.position.x + invader.width && 
//                 Projectile.position.y + Projectile.radius >=
//                     invader.position.y
//                 ) {

//                     setTimeout(() => {
//                         const invaderFound = grid.invaders.find(
//                             (invader2) => invader2 === invader
//                         )
//                         const ProjectileFound = Projectiles.find(
//                             Projectile2 => Projectile2 === Projectile)

//                         // remove invader and projectile
//                         if(invaderFound && ProjectileFound) {
//                             score += 100
//                             scoreEl.innerHTML = score
//                             overscoreEl.innerHTML = score
//                             createParticles({
//                               object: invader,
//                               fades: true
//                             })

//                             grid.invaders.splice(i, 1)
//                             Projectiles.splice(j, 1)
//                             soundsEffect.explodeSound.play()

//                             if(grid.invaders.length > 0) {
//                                 const firstInvader = grid.invaders[0]
//                                 const lastInvader = grid.invaders[grid.
//                                 invaders.length - 1]

//                                 grid.width = lastInvader.position.x -
//                                 firstInvader.position.x + 
//                                 lastInvader.width
//                                 grid.position.x = firstInvader.position.x
//                             }else {
//                                 grids.splice(gridIndex, 1)  
//                             }
//                         }
//                     }, 0);
//                 }
//             })
//         })
//     })

//     if (keys.a.pressed && player.position.x >= 0) {
//         player.velocity.x = -7
//         player.rotation = -0.15
//     } else if (keys.d.pressed && player.position.x + player.
//         width <= canvas.width) {   
//         player.velocity.x = 7
//         player.rotation = 0.15 
//     }else{
//         player.velocity.x = 0
//         player.rotation = 0
//     }
    
//     //spawning enemies
//     if (!grids.every(isActive)) {
//         spawnActive = false;
//     } else if (spawnActive && frames % randomInterval === 0) {
//         grids.push(new Grid());
//         randomInterval = Math.floor(Math.random() * 500 + 500);
//         frames = 0;
//     }

//     frames++;
// }
animate();

addEventListener("keydown", ({key}) => {
    if (game.over) return

    switch (key) {
        case "a":
            // console.log("left")
            
            keys.a.pressed = true
            break;
        case "d":
            // console.log("right")
            keys.d.pressed = true
            break; 
        case " ":
            // console.log("space")
            soundsEffect.playerShootSound.play()
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
            )
            // console.log(Projectiles)
            break;
            case "m":
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
})

addEventListener("keyup", ({key}) => {
    switch (key) {
        case "a":
            // console.log("left")
        
            keys.a.pressed = false;
            break;
        case "d":
            // console.log("right")
            keys.d.pressed = false;
            break; 
        case " ":
            // console.log("space")
            break; 
    }
})
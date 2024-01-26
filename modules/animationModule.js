import { canvas, c, player, soundsEffect,
    game, background, startButton,
    soundIcon, particles, invaderProjectiles,
    Projectiles, grids, keys, overTitle,
    isActive, menuButton, scoreTab,
    scoreEl, overscoreEl, overScore,
    } from "../index.js";
import { Grid, Particle} from "./classesModule.js";

export let frames;
export let score = 0;
export let randomInterval = Math.floor(Math.random() * 500 + 500);

export class StartButton {
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

export const saveScore = () => {
    window.localStorage.setItem("score", score);
}

export const loadScore = () => {
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
            radius: Math.random() * 3,
            color: color || "#BAA0DE",
            fades
        })
      )
    }
}

export function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    let spawnActive = true;
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.draw()
    startButton.draw()
    soundIcon.draw()
    player.update()
    particles.forEach((particle, i) => {

        if(particle.position.y - particle.radius >= canvas.
            height) {
                particle.position.x = Math.random() * canvas.width
                particle.position.y = -particle.radius
            }

        if(particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update();
        }
    })
    
    invaderProjectiles.forEach((InvaderProjectile, index) => {
        if(InvaderProjectile.position.y + InvaderProjectile.
            height >= canvas.height) {
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                }, 0)   
            } else InvaderProjectile.update()

            // projectile hits player
            if (InvaderProjectile.position.y + InvaderProjectile.height 
                    >= 
                player.position.y && InvaderProjectile.position.x +
                InvaderProjectile.width 
                    >= 
                player.position.x && 
                InvaderProjectile.position.x <= player.position.x +
                player.width
                ) 
                {
                    soundsEffect.explodeSound.play()
                    soundsEffect.backgroundSound.muted = !soundsEffect.backgroundSound.muted;
                    soundsEffect.enemyShootSound.muted = !soundsEffect.enemyShootSound.muted;
                    soundsEffect.gameOverSound.play()
                    setTimeout(() => {
                        invaderProjectiles.splice(index, 1)
                        player.opacity = 0
                        game.over = true
                    }, 0)

                    setTimeout(() => {
                        menuButton.classList.toggle("active");
                        overTitle.classList.toggle("active");
                        overScore.classList.toggle("active");
                        scoreTab.classList.remove("active");
                        grids.forEach((grid) => {
                            grid.isActive = false;
                        });
                        background.drawActive = true;
                        startButton.drawActive = true;
                        canvas.addEventListener("click", startButton.handleGameOverClick);
                        saveScore();
                    }, 3000);

                    createParticles({
                        object: player,
                        color: "white",
                        fades: true
                      }) 
                }
    })

    Projectiles.forEach((Projectile, index) => {

        if(Projectile.position.y + Projectile.radius <= 0){
            setTimeout(() => {
                Projectiles.splice(index, 1)
            }, 0)
        }else{
        Projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()

        // spawn projectiles
        if (frames % 199 === 0 && grid.invaders.length > 0) {
           soundsEffect.enemyShootSound.play();
           grid.invaders[Math.floor(Math.random() * grid.invaders.
            length)].shoot(
                invaderProjectiles
                )
        }

          // projectiles hit enemy
          grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})
            
            Projectiles.forEach((Projectile, j)=> {
               if (
                Projectile.position.y - Projectile.radius <= 
                    invader.position.y + invader.height &&
                Projectile.position.x + Projectile.radius >=
                    invader.position.x && 
                Projectile.position.x - Projectile.radius <= 
                    invader.position.x + invader.width && 
                Projectile.position.y + Projectile.radius >=
                    invader.position.y
                ) {

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        )
                        const ProjectileFound = Projectiles.find(
                            Projectile2 => Projectile2 === Projectile)

                        // remove invader and projectile
                        if(invaderFound && ProjectileFound) {
                            score += 100
                            scoreEl.innerHTML = score
                            overscoreEl.innerHTML = score
                            createParticles({
                              object: invader,
                              fades: true
                            })

                            grid.invaders.splice(i, 1)
                            Projectiles.splice(j, 1)
                            soundsEffect.explodeSound.play()

                            if(grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.
                                invaders.length - 1]

                                grid.width = lastInvader.position.x -
                                firstInvader.position.x + 
                                lastInvader.width
                                grid.position.x = firstInvader.position.x
                            }else {
                                grids.splice(gridIndex, 1)  
                            }
                        }
                    }, 0);
                }
            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -0.15
    } else if (keys.d.pressed && player.position.x + player.
        width <= canvas.width) {   
        player.velocity.x = 7
        player.rotation = 0.15 
    }else{
        player.velocity.x = 0
        player.rotation = 0
    }
    
    //spawning enemies
    if (!grids.every(isActive)) {
        spawnActive = false;
    } else if (spawnActive && frames % randomInterval === 0) {
        grids.push(new Grid());
        frames = 0;
        randomInterval = Math.floor(Math.random() * 500 + 500);
    }
    
    frames++;
}
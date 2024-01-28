import { canvas, c, player, soundsEffect,
    game, background, startButton,
    soundIcon, particles, invaderProjectiles,
    Projectiles, grids, keys, overTitle,
    isActive, menuButton, scoreTab,
    scoreEl, overscoreEl, overScore, overNewRecord,
    newRecordEl, invaderBoss, grid, bossProjectiles
    } from "../index.js";
import { BossProjectile, Grid, Particle, BossParticle,
    InvaderBoss} from "./classesModule.js";

export let frames;
export let score = 0;
export let randomInterval = Math.floor(Math.random() * 500 + 500);
let continueShooting = true;
let previousScore = parseInt(window.localStorage.getItem("score"), 10) || 0;
let spawnBoss = false;
export let bossActive = false;
let lastBossShotTime = 0;
const bossShotInterval = 700;
let projectilesHitBossCount = 0;

export class StartButton {
    constructor() {
        this.position = {
            x: 410,
            y: 370
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
            this.width = image.width / 0.7;
            this.height = image.height / 0.7;

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

    //reassignment button after game.over
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
        canvas.removeEventListener("click", this.handleGameOverClick);
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
        spawnBoss = true;
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
    if (score > previousScore) {
        window.localStorage.setItem("score", score);
        previousScore = score;  // Оновлюємо previousScore після збереження нового рекорду
    }
}

export const loadScore = () => {
    score = parseInt(window.localStorage.getItem("score"), 10) || 0;

    const textElement = document.getElementById("scoreSlide");
    scoreSlide.style.color = "#e60000";
    scoreSlide.style.filter = 'drop-shadow(1px 1px 10px #990000)';

    const newRow = document.createElement("p");
    newRow.innerHTML = `
        <p>${score}</p>
    `;
    textElement.appendChild(newRow);
}

// backgroundloop
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

//create explode
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

export function createBossParticles({object, color, fades}) {
    for (let i = 0; i < 15; i++) {
        particles.push(new BossParticle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 5,
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
                        continueShooting = false;
                    }, 0)

                    setTimeout(() => {
                        menuButton.classList.toggle("active");
                        overTitle.classList.toggle("active");
                        if (score > previousScore) {
                            // Якщо так, то зберігаємо новий рекорд
                            saveScore();
                            overNewRecord.classList.toggle("active");
                        } else {
                            // Інакше, показуємо поточний рекорд
                            overScore.classList.toggle("active");
                        }
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

    bossProjectiles.forEach(bossProjectile => {
        bossProjectile.update()
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
        if (frames % 199 === 0 && grid.invaders.length > 0 && continueShooting) {
           soundsEffect.enemyShootSound.play();
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
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
                            newRecordEl.innerHTML = score
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

    if (spawnBoss && score >= 100000) {
        invaderBoss.bossActive = true;     
        invaderBoss.update()
    }
    if(invaderBoss.bossActive) {
        grids.forEach((grid) => {
            grid.isActive = false;
            continueShooting = false;
        });

    }

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

    //spawn Boss projectiles
    if (invaderBoss.bossActive && invaderBoss) {
        const currentTime = Date.now();
    
        if (currentTime - lastBossShotTime > bossShotInterval && invaderBoss.velocity.x != 0) {
            invaderBoss.shoot(bossProjectiles);
            lastBossShotTime = currentTime;
        }

        for (let i = 0; i < bossProjectiles.length; i++) {
            const projectile = bossProjectiles[i];
    
            if (
                !projectile.hit &&
                projectile.position.x < player.position.x + player.width &&
                projectile.position.x + projectile.width > player.position.x &&
                projectile.position.y < player.position.y + player.height &&
                projectile.position.y + projectile.height > player.position.y
            ) {
                projectile.hit = true;
                invaderBoss.bossShooting = false;
                createParticles({
                    object: player,
                    color: "white",
                    fades: true
                  })
                  setTimeout(() => {
                    player.opacity = 0
                    game.over = true
                    invaderBoss.velocity.y = 5;
                    }, 0)
                    setTimeout(() => {
                        menuButton.classList.toggle("active");
                        overTitle.classList.toggle("active");
                        if (score > previousScore) {
                            saveScore();
                            overNewRecord.classList.toggle("active");
                        } else {
                            overScore.classList.toggle("active");
                        }
                        scoreTab.classList.remove("active");
                        grids.forEach((grid) => {
                            grid.isActive = false;
                        });
                        background.drawActive = true;
                        startButton.drawActive = true;
                        canvas.addEventListener("click", startButton.handleGameOverClick);
                        saveScore();
                        
                    }, 3000);
                bossProjectiles.splice(i, 1)
                
            }
        }

        Projectiles.forEach((playerProjectile, j) => {
            if (
                playerProjectile.position.y - playerProjectile.radius <= invaderBoss.position.y + invaderBoss.height &&
                playerProjectile.position.x + playerProjectile.radius >= invaderBoss.position.x &&
                playerProjectile.position.x - playerProjectile.radius <= invaderBoss.position.x + invaderBoss.width &&
                playerProjectile.position.y + playerProjectile.radius >= invaderBoss.position.y
            ) {
                console.log("Boss lose");
                Projectiles.splice(j, 1);
                createParticles({
                    object: invaderBoss,
                    color: "green",
                    fades: true
                  })
        
                projectilesHitBossCount++;
        
                if (projectilesHitBossCount === 100) {
                    console.log("Boss destroyed");
                    invaderBoss.bossActive = false;
                    spawnBoss = false;
                    createBossParticles({
                        object: invaderBoss,
                        color: "green",
                        fades: true,
                    });
                }
            }
        });
    
        invaderBoss.update();
    }
    
    frames++;
}
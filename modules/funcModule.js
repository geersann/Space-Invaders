const helpers = {

    saveScore : () => {
        window.localStorage.setItem("score", score);
    },
    
    loadScore : () => {
        score = parseInt(window.localStorage.getItem("score"), 10) || 0;
    
        const textElement = document.getElementById("scoreSlide");
    
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>1</td>
            <td>Player</td>
            <td>${score}</td>
        `;
        textElement.appendChild(newRow);
    },
    
    createParticles : function({object, color, fades}) {
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
    },
    
    toggleBackgroundSound : function() {
        if (isBackgroundSoundMuted) {
            soundsEffect.backgroundSound.play();
        } else {
            soundsEffect.backgroundSound.pause();
        }
    
        isBackgroundSoundMuted = !isBackgroundSoundMuted;
    },
    
    animate : function() {
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
            randomInterval = Math.floor(Math.random() * 500 + 500);
            frames = 0;
        }
    
        frames++;
    }
}

export const saveScore = helpers.saveScore;
export const loadScore = helpers.loadScore;
export const createParticles = helpers.createParticles;
export const toggleBackgroundSound = helpers.toggleBackgroundSound;
export const animate = helpers.animate;
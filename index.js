const scoreEl = document.querySelector("#scoreEl");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

canvas.width = innerWidth
canvas.height = innerHeight


const playerShoot = new Audio ("./sounds/shoot.wav");
playerShoot.volume = 0.1

class StartButton {
    constructor() {
        this.position = {
            x: 1130,
            y: 800
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = "./img/button.png"
        image.onload = () => {
            this.image = image
            this.width = image.width / 0.4
            this.height = image.height / 0.4

            this.addEventListeners();
        }
    }

    addEventListeners() {
        canvas.addEventListener("click", this.handleCanvasClick.bind(this));
    }

    // addEventListener for canvas click
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
        }
    }

    animateBackground() {
        player.opacity = 1;
        game.over = false;
        frames = 0;

        const scoreTab = document.querySelector(".score-tab");
        scoreTab.classList.toggle("active");

        canvas.removeEventListener("click", this.handleCanvasClick.bind(this));
    }

    draw() {
        if (this.image)
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
    }
}

class StartBackground {
    constructor() {
        this.position = {
            x: 570,
            y: 300
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.opacity = 1
        const image = new Image()
        image.src = "./img/startScreenBackground.png"
        image.onload = () => {
            this.image = image
            this.width = image.width / 0.5
            this.height = image.height / 0.5
        }
    }
    draw() {
            if(this.image)
                c.drawImage(
                    this.image,
                    this.position.x,
                    this.position.y,
                    this.width,
                    this.height
            )
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

class Invader {
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

class Grid {
    constructor() {
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

        this.width = columns * 30

        for(let x = 0; x < columns; x++) {
            for(let y = 0; y < rows; y++) {
                this.invaders.push(
                        new Invader({
                            position: {
                                x: x * 30,
                                y: y * 30
                            }
                        })
                    )
                }
        }    
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if(this.position.x + this.width >= canvas.width || this.
            position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

let frames;
const player = new Player()
const background = new StartBackground();
background.draw()
const button = new StartButton();
button.draw()
const Projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];

const keys = {
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


let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
    over: true,
    active: true,
}
let score = 0

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

function createParticles({object, color, fades}) {
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

// function animateBackground() {
//     player.opacity = 1;
//     game.over = false;
//     frames = 0;

//     const scoreTab = document.querySelector(".score-tab"); 
//     scoreTab.classList.toggle("active");

//     removeEventListener("click", animateBackground);
// }

// addEventListener("click", animateBackground);

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.draw()
    button.draw()
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
                ) {

                    setTimeout(() => {
                        invaderProjectiles.splice(index, 1)
                        player.opacity = 0
                        game.over = true
                    }, 0)

                    setTimeout(() => {
                        game.active = false
                        const scoreTab = document.querySelector(".score-tab");
                        scoreTab.classList.remove("active");
                        
                    }, 2000)

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
                            console.log(score)
                            scoreEl.innerHTML = score
                            createParticles({
                              object: invader,
                              fades: true
                            })


                            grid.invaders.splice(i, 1)
                            Projectiles.splice(j, 1)

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
    if(frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
            
    }

    frames++
}
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
            playerShoot.play()
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
 import { canvas, c, player, soundsEffect, game, background} from "../index.js";
 
export class StartBackground {
    constructor() {
        this.position = {
            x: 150,
            y: 100
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
            this.width = image.width / 1;
            this.height = image.height / 1;
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
};

export class SoundIcon {
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
            this.width = this.image1.width / 1;
            this.height = this.image1.height / 1;
        };

        this.image2 = new Image();
        this.image2.src = "./img/muteIcon.jpg";

        this.currentImage = this.image1;
    }

    //changing the img when pressing the "m" key
    toggleImage() {
        this.currentImage = (this.currentImage === this.image1) ? this.image2 : this.image1;

        this.width = this.currentImage.width / 1;
        this.height = this.currentImage.height / 1;
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
};

export class Player {
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
            const scale = 0.1
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
};

export class Projectile {
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
};

//particle when invaders expolode
export class Particle {
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
};

export class InvaderProjectile {
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
};

export class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = "./img/invader.png"
        image.onload = () => {
            const scale = 0.7
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
};

export class Grid {
    constructor() {
        this.isActive = true;

        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 1.5,
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
                            x: x * 20,
                            y: y * 20
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
};

export class InvaderBoss {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0.5
        };

        const image = new Image();
        image.src = "./img/invader-boss.webp";
        image.onload = () => {
            const scale = 0.7;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: -this.height
            };
        };
    }

    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if (this.position.y + this.height >= 160) {
                this.velocity.y = 0;
            }
            if(this.position.y + this.height > 150 && this.position.y + this.height != 160){
                this.velocity.x = 0.5;
            }
            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x;
            }
        }
    }
}

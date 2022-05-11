const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')


// gamescreen size
canvas.height = 625;
canvas.width = 600;

// player class for ship
class Player {
    constructor() {
        this.position = {
            x: canvas.width / 2,
            y: canvas.height - 100
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        // const image = new Image()
        // image.src = "../imgs/spaceship.png"

        this.width = 20
        this.height = 40
    }
    draw() {
      ctx.fillStyle = 'white'
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    //   ctx.drawImage(this.image, this.position.x, this.position.y)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

// projectile class for when player fires
class Projectile {
        constructor({position, velocity, color, width, height}){
            this.position = position
            this.velocity = velocity
            
            this.radius = 4
            // this.width = 5
            // this.height = 10
             
        }
        // projectile is a circle, this renders it
        draw() {
            ctx.beginPath()
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
            ctx.fillStyle = 'red'
            ctx.fill()
            ctx.closePath()
        }
        // update for projectile trajectory 
        update() {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
}

class Particle {
    constructor({position, velocity, radius}){
        this.position = position
        this.velocity = velocity
        
        this.radius = radius
        this.opacity = 1
         
    }
    // projectile is a circle, this renders it
    draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'goldenrod'
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    // update for projectile trajectory 
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.opacity -= 0.01
    }
}

// new class for the meteors 
class Meteor {
    constructor() {
        this.position = {
            x: Math.floor(Math.random() * canvas.width),
            y: 0
        }

        this.velocity = {
            x: Math.random() * 2 - 1,
            y: 3
        }

        // const image = new Image()
        // image.src = 

        this.width = 55
        this.height = 55
    }
    draw() {
      ctx.fillStyle = 'darkorange'
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    //   ctx.drawImage(this.image, this.position.x, this.position.y)
    } 
    update() {
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        // if statement to keep meteors on screen, changes the x velocity when hits the side
        if(this.position.x + this.width >= 600) {
            this.velocity.x = -this.velocity.x
        } else if (this.position.x <= 0){
            this.velocity.x = -this.velocity.x
        }
    }
}

// player
const player = new Player()

// meteors array
const meteors = []

// projectiles array
const projectiles = []

// explosion particles array
const particles = []

// keys variable for movement handler
const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

// function to continue spawning meteors at top of gamescreen
function spawnMeteors(){
    meteors.push(new Meteor)
}

// interval at which the meteors spawn
setInterval(spawnMeteors, (Math.random() * 750) + 1000 )

function createParticles({object}) {
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
            radius: Math.random() * 5,
        }))
    }
}

// animate & update loop function for game functions
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    // fading the explosion particles opacity and removing them
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            },0 ) 
        } else {
            particle.update()
        }        
    })
    // continue pushing new meteors into meteor array, spawning them
    meteors.forEach((meteor, index) => {
        meteor.update()
        // collision detection for meteor hitting ship
        if(meteor.position.y + meteor.height >= player.position.y &&
            meteor.position.x + meteor.width >= player.position.x &&
            meteor.position.x <= player.position.x + player.width) {
                setTimeout(() => {
                    meteors.splice(index, 1)
                })
            createParticles({
                object: player
            })
        }

        // projectile collision detection
        projectiles.forEach((projectile, indexP) => {
            if (projectile.position.y - projectile.radius <= 
                meteor.position.y + meteor.height &&
                projectile.position.x + projectile.radius >=
                meteor.position.x &&
                projectile.position.x - projectile.radius <=
                meteor.position.x + meteor.width &&
                projectile.position.y + projectile.radius >=
                meteor.position.y) {

                   
                    // removes meteor & projectile from respective arrays 
                    // & removes from screen once hit
                setTimeout(() => {
                    // deeper collision detection for direct meteor & projectile contact
                    const meteorFound = meteors.find(meteor2 => {
                        return meteor2 === meteor
                    })
                    const projectileFound = projectiles.find(projectile2 => {
                        return projectile2 === projectile
                    })
                    // if meteor & projectile found remove that specific meteor and that specific projectile
                    if (meteorFound && projectileFound) {
                    createParticles({
                        object: meteor
                    })
                    meteors.splice(index, 1)
                    projectiles.splice(indexP, 1)
                    }
                }, 0 )                
            }
        })
    }) 

    projectiles.forEach((Projectile, index) => {
        // removing old projectiles from array after they leave game screen
    if (Projectile.position.y + projectiles.radius <= 0) {
        setTimeout(() => {
            projectiles.splice(index, 1)
        }, 0)     
    } else {
            Projectile.update()
    }
})
    // movement handler & left and right border stop
    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -7
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= 600) {
        player.velocity.x = 7
    } else {
        player.velocity.x = 0
    }
}

animate()

// keydown event listener to START player movement & fire projectiles
addEventListener('keydown', ({key}) => {
    switch(key) {
        case 'ArrowLeft':
            // console.log('left')      
            keys.ArrowLeft.pressed = true
            break
        case 'ArrowRight':
            // console.log('right')
            keys.ArrowRight.pressed = true
            break
        case ' ':
            // console.log('space')
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + 10,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -9
                }
            }))
            break 
    }
})

// keyup event listener to STOP movement side to side
addEventListener('keyup', ({key}) => {
    switch(key) {
        case 'ArrowLeft':
            // console.log('left')      
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            // console.log('right')
            keys.ArrowRight.pressed = false
            break
        case ' ':
            // console.log('space')
            break 
    }
})

// class Earth {
//     constructor() {
//         this.x = 0
//         this.y = 330
//         this.color = 'green'
//         this.width = 300
//         this.height = 30
//         this.alive = true
//     }

//     render() {
//         ctx.fillStyle = this.color
//         ctx.fillRect(this.x, this.y, this.width, this.height)
//     }
// }

// const earth = new Earth()

// function detectHit(projectile, meteor) {
    
//     if (
//         projectile.x + projectile.width >= meteor.x &&
//         projectile.x <= meteor.x + meteor.width &&
//         projectile.y + projectile.height >= meteor.y &&
//         projectile.y <= meteor.y + meteor.height
//     ) {
//         // console.log('hit')
//         return true
    
//     }
//     return false

   
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

// new class for the meteors 
class Meteor {
    constructor() {
        this.position = {
            x: randX - 10,
            y: 0
        }

        this.velocity = {
            x: 1,
            y: 3
        }

        // const image = new Image()
        // image.src = 

        this.width = 55
        this.height = 55
    }
    draw() {
      ctx.fillStyle = 'orange'
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
        }
    }
}

// random x coordinate variable for meteor spawn position
const randX = Math.floor(Math.random() * canvas.width)

const meteors = new Meteor()

const player = new Player()

// projectiles array - fired projectiles
const projectiles = []
    
// variable for keys for movement handler
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

let frames = 0

// animate & update loop function for game functions
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    meteors.update()
    player.update()
    projectiles.forEach((Projectile, index) => {
        // removing old projectiles from array after they leave screen
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

    // if(frames % 1000 === 0){
    //     meteors.update()
    // }
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

// function animate() {
//     projectiles.forEach((projectile) => {
//         projectile.update()
//     })
// }

// function drawBox(x, y, w, h, color) {
//     ctx.fillStyle = color
//     ctx.fillRect(x, y, w, h)
// }


// function movementHandler(e) {
//     const speed = 15
//     switch(e.key) {

//       case('ArrowLeft'):
//         player.x = player.x - speed
//         break
//       case('ArrowRight'):
//         player.x = player.x + speed
//         break
//     }
// }

// function detectHit() {
//     // Axis Aligned Bounding Box (AABB) collision detection algorithm
//     // const meteorLeft = player.x + player.width >= meteor.x
//     // // // console.log('left', meteorLeft)
//     // const meteorRight = player.x <= meteor.x + meteor.width
//     // // // console.log('right', meteorRight)
//     // const meteorTop = player.y + player.height >= meteor.y
//     // const meteorBottom = player.y <= meteor.y + meteor.height
//     // // console.log(meteorBottom)
//     if (
//         player.x + player.width >= meteor.x &&
//         player.x <= meteor.x + meteor.width &&
//         player.y + player.height >= meteor.y &&
//         player.y <= meteor.y + meteor.height
//     ) {
//         // console.log('hit')
//         meteor.alive = false
    
//     }
// }


// // all of the main game logic executed every frame
// function gameLoop() {
//     // clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     meteor.y += 6
//     detectHit()
    
//     if (player.alive) {
//         meteor.render()
//     }
//     earth.render()
//     player.render()
// }

// document.addEventListener('keydown', movementHandler)
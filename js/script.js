const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

// score tracker
const scoreValue = document.getElementById('scoreValue')

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
       
        // this.image = image
        this.opacity = 1
        this.width = 20
        this.height = 40
    }
    draw() {
      ctx.globalAlpha = this.opacity
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
            // projectile radius for circle render
            this.radius = 4
             
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

// particle class for explosion animation
class Particle {
    constructor({position, velocity, radius}){
        this.position = position
        this.velocity = velocity
        
        this.radius = radius
        this.opacity = 1
         
    }

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
    // update for particle trajectory & fade
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
            y: 0 - 50
        }

        this.velocity = {
            x: Math.random() * 2 - 1,
            y: 4.2
        }

        this.width = 50
        this.height = 50
    }
    draw() {
      ctx.fillStyle = 'darkorange'
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
   
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

// new class for earth at bottom of gamescreen to defend
class Earth {
    constructor() {
        this.position = {
            x: 0,
            y: 595
        }
        
        this.color = 'green'
        this.width = 600
        this.height = 100
        // this.alive = true
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
    }
}

// player
let player = new Player()

// meteors array
let meteors = []

// projectiles array
let projectiles = []

// explosion particles array
let particles = []

// earth
let earth = new Earth()

// start sound
const startSound = new Audio('./audio/start_sound.wav')

// level music
const levelMusic = new Audio('./audio/level_music.wav')

// meteors destroyed audio
const meteorExplosion = new Audio('./audio/meteor_explosion.wav')

// firing projectiles audio
const projectileSound = new Audio('./audio/fire_projectile.wav')

// ship explosion audio
const shipDestroyed = new Audio('./audio/ship_explosion.wav')

// earth explosion audio
const earthDestroyed = new Audio('./audio/earth_explosion.wav')

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

// game over variable
let game = {
    over: false,
    active: false
}

// initial score
let score = 0

// initialize game function
function init() {
    startSound.play()
    player = new Player()
    meteors = []
    projectiles = []
    particles = []
    earth = new Earth()
    score = 0
    animate()
}

// function to continue spawning meteors at top of gamescreen
function spawnMeteors(){
    meteors.push(new Meteor)
}

// interval at which the meteors spawn
setInterval(spawnMeteors, (Math.random() * 750) + 1000 )

// create particles function for animating explosions of meteors & ships
function createParticles({object}) {
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            },
            radius: Math.random() * 5,
        }))
    }
}

// creat particle function but with larger & more particles for earth explosion
function earthExplosion({object}) {
    earthDestroyed.play()
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height - 75
            },
            velocity: {
                x: (Math.random() - 0.5) * 6,
                y: (Math.random() - 0.5) * 6
            },
            radius: Math.random() * 15,
        }))
    }
}

// game functions animate
function animate() {
    levelMusic.play()
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    earth.update()
    // fading the explosion particle opacity and removing them once theyve faded
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            },0 ) 
        } else {
            particle.update()
        }        
    })
    // meteor update & removal with collision detection below
    meteors.forEach((meteor, index) => {
        meteor.update()
        // lose condition if meteor hits ship
        if (meteor.position.y + meteor.height >= player.position.y &&
            meteor.position.x + meteor.width >= player.position.x &&
            meteor.position.x <= player.position.x + player.width) {
                shipDestroyed.play()
                setTimeout(() => {
                    // ship explosion, removing ship and meteor from screen & game over
                    meteors.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                }, 0 )
            createParticles({
                object: player
            }) // collision detection for meteors & earth
        } else if (meteor.position.y + meteor.height >= earth.position.y) {
            setTimeout (() => {
                meteors.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0 ) // earth explosion particle animation
            earthExplosion ({
                object: earth
            })
        }
        // projectile & meteor collision detection
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
                    // deeper collision detection for specific meteor & specific projectile contact
                    const meteorFound = meteors.find(meteor2 => {
                        return meteor2 === meteor
                    })
                    const projectileFound = projectiles.find(projectile2 => {
                        return projectile2 === projectile
                    })
                    // if target meteor & target projectile found, removes them & creates explosion effect 
                    if (meteorFound && projectileFound) {
                        meteorExplosion.play()
                        // adds 100 points for each meteor destroyed
                        score += 100
                        scoreValue.innerText = score
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
    // tracking the projectiles fired
    projectiles.forEach((Projectile, index) => {
        // removing old projectiles from array after they leave game screen for missed shots
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

// event listener to begin game once you click the "ORBITAL DEFENSE" start button
document.getElementById('start').addEventListener('click', () => {
    init()
})

// event listener to ensure button only gets clicked once
document.getElementById('start').onclick = function () {
    this.disabled = true;
    
}

let toggleVisual = false;
// function to make start button unclickable after first click & game start
let hideVisual = function() {
  let visual = document.getElementsById('start');

  if (toggleVisual = false) {
    visual.disabled = true;
    toggleVisual = true;
  }
}

// keydown event listener to START player movement & fire projectiles
addEventListener('keydown', ({key}) => {
    if (game.over) return
    switch(key) {
        case 'ArrowLeft':     
            keys.ArrowLeft.pressed = true
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            break
        case ' ':
            projectileSound.play()
            // pushes new projectile into array when fired
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

// keyup event listener to STOP player movement side to side
addEventListener('keyup', ({key}) => {
    switch(key) {
        case 'ArrowLeft':     
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case ' ':
            break 
    }
})

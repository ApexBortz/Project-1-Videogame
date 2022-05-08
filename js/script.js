const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

const gameLoopInterval = setInterval(gameLoop, 100)

canvas.height = 350;
canvas.width = 300;

class Spaceship {
    constructor(x, y, color, width, height) {
        this.x = x
        this.y = y
        this.color = color
        this.width = width
        this.height = height
        this.alive = true
    }

    render() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}


class Earth {
    constructor() {
        this.x = 0
        this.y = 330
        this.color = 'green'
        this.width = 300
        this.height = 30
        this.alive = true
    }

    render() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const player = new Spaceship(140, 280, 'white', 15, 25)

const randX = Math.floor(Math.random() * canvas.width)

const meteor = new Spaceship(randX, 1, 'orange', 30, 30)

const earth = new Earth()

function drawBox(x, y, w, h, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
}


function movementHandler(e) {
    const speed = 10
    switch(e.key) {

      case('a'):
        player.x = player.x - speed
        break
      case('d'):
        player.x = player.x + speed
        break
    }
}

function detectHit() {
    // Axis Aligned Bounding Box (AABB) collision detection algorithm
    // const ogreLeft = hero.x + hero.width >= ogre.x
    // // console.log('left', ogreLeft)
    // const ogreRight = hero.x <= ogre.x + ogre.width
    // // console.log('right', ogreRight)
    // const ogreTop = hero.y + hero.height >= ogre.y
    // const ogreBottom = hero.y <= ogre.y + ogre.height
    // console.log(ogreBottom)
    if (
        player.x + player.width >= meteor.x &&
        player.x <= meteor.x + meteor.width &&
        player.y + player.height >= meteor.y &&
        player.y <= meteor.y + meteor.height
    ) {
        // console.log('hit')
        meteor.alive = false
    
    }
}


// all of the main game logic executed every frame
function gameLoop() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // do all the game logic
    detectHit()
    // render the game objects
    if (meteor.alive) {
        meteor.render()
    }
    earth.render()
    player.render()
}

document.addEventListener('keydown', movementHandler)
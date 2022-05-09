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

class Projectile {
    constructor({position, velocity, color, width, height}){
        this.position = position
        this.velocity = velocity
        this.color = 'red'
        this.width = 3
        this.height = 5
         
    }

    draw() {
        canvas.beginPath()
        // canvas.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        canvas.fillStyle = 'red'
        canvas.fill()
        canvas.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
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

const projectiles = [new Projectile({
    position: {
        x: 150,
        y: 400
    },
    velocity: {
        x: 0,
        y: 0
    }
})]


const randX = Math.floor(Math.random() * canvas.width)

const meteor = new Spaceship(randX, 1, 'orange', 25, 25)

// const projectile = new Spaceship(player.x, player.y, 'red', 5, 5)

const earth = new Earth()

function animate() {
    projectiles.forEach((projectile) => {
        projectile.update()
    })
}

function drawBox(x, y, w, h, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
}


function movementHandler(e) {
    const speed = 15
    switch(e.key) {

      case('ArrowLeft'):
        player.x = player.x - speed
        break
      case('ArrowRight'):
        player.x = player.x + speed
        break
    }
}

function detectHit() {
    // Axis Aligned Bounding Box (AABB) collision detection algorithm
    // const meteorLeft = player.x + player.width >= meteor.x
    // // // console.log('left', meteorLeft)
    // const meteorRight = player.x <= meteor.x + meteor.width
    // // // console.log('right', meteorRight)
    // const meteorTop = player.y + player.height >= meteor.y
    // const meteorBottom = player.y <= meteor.y + meteor.height
    // // console.log(meteorBottom)
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
    meteor.y += 6
    detectHit()
    
    if (player.alive) {
        meteor.render()
    }
    earth.render()
    player.render()
}

document.addEventListener('keydown', movementHandler)
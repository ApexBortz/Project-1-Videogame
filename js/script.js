const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')


canvas.height = 300;
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

const player = new Spaceship(140, 250, 'white', 15, 25)
player.render()

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

document.addEventListener('keydown', movementHandler)
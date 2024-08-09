// Create our canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set our canvas dimensions
canvas.width = 1024
canvas.height = 576

// Draw onto our cavnas - specifically the background
c.fillRect(0, 0, canvas.width, canvas.height)

// Class for our sprites, made one as they'll have individual properties
// constructor is always fired when sprite class is called - needed for classes
// 'this' is similar to python with 'self'
// Takes a position as an argument that will be assigned to the relevant sprite
// Rather than passing in multiple arguments, we create an object with the key being our arguments, that way we dont have to remember 
// the order of our arguments.

const gravity = 0.2

class Sprite{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.height = 150
    }
    // Creating draw function, references position in constructor and x, y in object
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    update(){
     this.draw()
     this.position.y += this.velocity.y

     if(this.position.y + this.height >= canvas.height){
        this.velocity.y = 0
     } else this.velocity.y += gravity // means gravity only works if our players are on screen/above the "floor"
    }
    
}

const player = new Sprite({
    position: {
    x: 0,
    y: 0
    },

    velocity :{
    x: 0,
    y: 0   
    }
})


const enemy = new Sprite({
    position: {
    x: 400,
    y: 100
    },

    velocity :{
    x: 0,
    y: 0   
    }
})




// that window call basically loops whatever function is put into it, almost like a recursive function
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black' // keeps our bg color as is
    c.fillRect(0,0, canvas.width, canvas.height) // Keeps our background as is
    player.update() // as we have our draw function in our update, we no longer need to call it separately.
    enemy.update()
    
    
}

animate()


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

const gravity = 0.7

class Sprite{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.lastKey
    }
    // Creating draw function, references position in constructor and x, y in object
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    update(){
     this.draw()
     this.position.y += this.velocity.y
     this.position.x += this.velocity.x

     if(this.position.y + this.height + this.velocity.y >= canvas.height){
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


// Created an object for keys and set it false, so that once key is pressed we can make it true triggering our if statement below
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
    
    

    
}
// that window call basically loops whatever function is put into it, almost like a recursive function
// Created this variable so that the last key that was pressed has 'priority' and thus it's command will fire. 

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black' // keeps our bg color as is
    c.fillRect(0,0, canvas.width, canvas.height) // Keeps our background as is
    player.update() // as we have our draw function in our update, we no longer need to call it separately.
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    }
    
    
}

animate()

window.addEventListener('keydown', (event) =>{
    
switch(event.key){
    case "d":
        keys.d.pressed = true
        player.lastKey = 'd'
        break
    case "a":
        keys.a.pressed = true
        player.lastKey = 'a'
        break
    case "w":
        player.velocity.y = -20
        break

    case "ArrowRight":
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
    case "ArrowLeft":
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
    case "ArrowUp":
        enemy.velocity.y = -20
        break
}
console.log(event.key)
} )

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        case "d":
            keys.d.pressed = false
            break
        case "a":
            keys.a.pressed = false
            break
        

        // enemy keys  
         case "ArrowRight":
            keys.ArrowRight.pressed = false
            break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break
        
    }
    console.log(event.key)
    } )


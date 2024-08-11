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
    constructor({position, velocity, color = "red", offset}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position:{
                x: this.position.x, // makes it so that attack box isn't entirely dependent on parent (player/enemy) position - can be slightly altered
                y: this.position.y
            },
            offset: offset, // could also do just offset as they have the same name (shorthand)
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }
    // Creating draw function, references position in constructor and x, y in object
    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attack box
        if(this.isAttacking){ // if statement to make it so that attack box only shows when is attacking is true
            c.fillStyle = "blue"
            c.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height)
        }
        
    }

    update(){
     this.draw()
     this.attackBox.position.x = this.position.x + this.attackBox.offset.x
     this.attackBox.position.y = this.position.y
     this.position.y += this.velocity.y
     this.position.x += this.velocity.x

     if(this.position.y + this.height + this.velocity.y >= canvas.height){
        this.velocity.y = 0
     } else this.velocity.y += gravity // means gravity only works if our players are on screen/above the "floor"
    }

    attack() {
        this.isAttacking = true // function fired, attacking is true
        setTimeout( () => {
           this.isAttacking = false // use set time out to turn it false after 100 milliseconds
        }, 100)}
}



const player = new Sprite({
    position: {
    x: 0,
    y: 0
    },

    velocity :{
    x: 0,
    y: 0   
    },
    offset: {
        x:0,
        y:0
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
    },

    color: "yellow",
    offset: { // we can now change enemy's attack box to face player
        x:-50,
        y:0
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

function rectangularCollision({rectangle1, rectangle2}) {
       return(rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y)
}

function determineWinner({player, enemy, timerID}){
    clearTimeout(timerID)
     document.querySelector('#displayText').style.display = 'flex'
        if(player.health === enemy.health){
            document.querySelector('#displayText').innerHTML = 'Tie' 
        } else if(player.health > enemy.health){
            document.querySelector('#displayText').innerHTML = 'Player 1 Wins' 
        } else{
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
        }
    }


let timer = 10
let timerID
function decreaseTimer(){
    if(timer>0){
        timerID = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer }
    
        if(timer === 0){
        determineWinner({player,enemy,timerID})
    }
}

decreaseTimer()


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
    
    // detect for collision - if furthest side of attack box is >= enemy left side
    if (
       rectangularCollision({ //made a function so that collision can be detected for both player and enemy without having to repeat the code
        rectangle1: player,
        rectangle2: enemy
       }) &&
        player.isAttacking) // player.isAttacking also needs to be true
        {
        player.isAttacking = false // this makes player hit only once and not multiple times
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
          
    }

    if (
        rectangularCollision({ //enemy collision detection - swapped rectangles
         rectangle1: enemy,
         rectangle2: player
        }) &&
         enemy.isAttacking) // 
         {
         enemy.isAttacking = false // this makes player hit only once and not multiple times
         player.health -= 20
         document.querySelector('#playerHealth').style.width = player.health + '%'
           
     }

     // end game based on health

     if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy, timerID})

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
    case " ":
        player.attack()
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
    case "ArrowDown":
        enemy.attack()
}

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
    
    } )


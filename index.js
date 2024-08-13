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

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/background.png' // our bg or sprite class takes a position and image source so we input both here
})

const shop = new Sprite({
    position: {
        x:600,
        y:128
    },
    imageSrc: './img/shop.png',  // our bg or sprite class takes a position and image source so we input both here
    scale: 2.75,
    framesMax : 6
})

const player = new Fighter({
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
    },
    imageSrc:'./img/samuraiMack/Idle.png',
    framesMax: 8, // frames = how many frames/images in the image
    scale: 2.5
})


const enemy = new Fighter({
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


decreaseTimer()


// that window call basically loops whatever function is put into it, almost like a recursive function
// Created this variable so that the last key that was pressed has 'priority' and thus it's command will fire. 

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black' // keeps our bg color as is
    c.fillRect(0,0, canvas.width, canvas.height) // Keeps our background as is
    background.update() // we want our bg image in the back so has to be rendered first.
    shop.update()
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


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
    scale: 2.5,
    offset: {
        x: 215,
        y: 156
    },
    sprites:{ // this is so that we can loop through the different sprites in this object.
        idle: {
            imageSrc :'./img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc :'./img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc :'./img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall : {
            imageSrc :'./img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1 : {
            imageSrc :'./img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc:'./img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc:'./img/samuraiMack/Death.png',
            framesMax: 6
        } 
    },
    attackBox :{
        offset:{
            x:70,
            y:50 // this offset affects where our attack box is - if this makes contact with enemy when pressing attack, health will deplete
        },
        width: 180,
        height: 50
    }
})

console.log(player)


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
    },
    imageSrc:'./img/kenji/Idle.png',
    framesMax: 4, // frames = how many frames/images in the image
    scale: 2.5,
    offset: {
        x: 215,
        y: 166
    },
    sprites:{ // this is so that we can loop through the different sprites in this object.
        idle: {
            imageSrc :'./img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc :'./img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc :'./img/kenji/Jump.png',
            framesMax: 2
        },
        fall : {
            imageSrc :'./img/kenji/Fall.png',
            framesMax: 2
        },
        attack1 : {
            imageSrc :'./img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc:'./img/kenji/Take hit.png',
            framesMax: 3
        } ,
        death: {
            imageSrc:'./img/kenji/Death.png',
            framesMax: 7
        }   },
        attackBox :{
            offset:{
                x:-172,
                y:50
            },
            width: 172,
            height: 50
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
    c.fillStyle = 'rgba(255,255,255, 0.10)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update() // as we have our draw function in our update, we no longer need to call it separately.
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run') //  when we press either a or d our sprite image changes to the run png
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else{
        player.switchSprite('idle') // makes it so that our default is idle
    }
    
    // player jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else{
        enemy.switchSprite('idle')
    }

    // enemy jumping

    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }
    
    // detect for collision - if furthest side of attack box is >= enemy left side
    if (
       rectangularCollision({ //made a function so that collision can be detected for both player and enemy without having to repeat the code
        rectangle1: player,
        rectangle2: enemy
       }) &&
        player.isAttacking && player.framesCurrent == 4) // player.isAttacking also needs to be true
        {
        enemy.takeHit()
        player.isAttacking = false // this makes player hit only once and not multiple times
        

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
          
    }

    // if player misses - sets is attacking back to false unlike the above where it only does this upon collision. 

    if (player.isAttacking && player.framesCurrent == 4){
        player.isAttacking = false
    }

    if (
        rectangularCollision({ //enemy collision detection - swapped rectangles
         rectangle1: enemy,
         rectangle2: player
        }) &&
         enemy.isAttacking && enemy.framesCurrent == 2) // 
         {
         enemy.isAttacking = false // this makes player hit only once and not multiple times
         player.takeHit()
         
         gsap.to('#playerHealth', {
            width: player.health + '%'
        }) // we use gsap for a smoother animation on health decrease
           
     }

        // if enemy misses
     if (enemy.isAttacking && enemy.framesCurrent == 2){
        enemy.isAttacking = false
    }

     // end game based on health

     if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy, timerID})

     }
}

animate()

window.addEventListener('keydown', (event) =>{
if(!player.dead){
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
            break}}
    
if(!enemy.dead){   
    switch(event.key){
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


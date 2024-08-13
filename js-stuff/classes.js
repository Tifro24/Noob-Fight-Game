
class Sprite{
    constructor({position, imageSrc, scale = 1, framesMax = 1}){
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0 // the more we add to our frames current, the more the crop shape shifts to the next frame.
        this.framesElapsed = 0 // how many frames have we currrently elapsed over throughout or whole animation.
        this.framesHold = 7 // how many frames should we actually go through before changing frames current
       
    }
    
    draw(){
        c.drawImage(this.image,
            this.framesCurrent * (this.image.width / this.framesMax), //crop location, below is crop width and height. We use the x property to shift our crop 'shape'  over to the next image, however it does the same with the bg, so we need to implement a current frame.
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // the above is how we crop the specific frame we need

            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale, //this has to be adjusted to as we want only a 6th of the width of our shop image. Changed it to a argument so it doesn't affect background too.
            this.image.height * this.scale) //this.image.width makes it so that the properties match the width and height of the respective image. This.scale is so that we can multiply it and scale it up if need be.  
    }

    update(){
     this.draw()
     this.framesElapsed++
     if(this.framesElapsed % this.framesHold === 0){ 
        if (this.framesCurrent < this.framesMax - 1){
            this.framesCurrent++
        } else{
            this.framesCurrent = 0
        }
    }
}

 
}


class Fighter extends Sprite{ // extends takes all properties from sprite and puts them in fighter class if not available
    constructor({position, velocity, color = "red", offset, imageSrc, scale = 1, framesMax = 1}){
        
        super({position, imageSrc, scale, framesMax})
        
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
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5 //moved these frame variants here apart from framesMax as it is passed through in the object above.
    }
    // Creating draw function, references position in constructor and x, y in object
 

    update(){
     this.draw()
     this.attackBox.position.x = this.position.x + this.attackBox.offset.x
     this.attackBox.position.y = this.position.y
     this.position.y += this.velocity.y
     this.position.x += this.velocity.x

     if(this.position.y + this.height + this.velocity.y >= canvas.height - 96){
        this.velocity.y = 0
     } else this.velocity.y += gravity // means gravity only works if our players are on screen/above the "floor"
    }

    attack() {
        this.isAttacking = true // function fired, attacking is true
        setTimeout( () => {
           this.isAttacking = false // use set time out to turn it false after 100 milliseconds
        }, 100)}
}

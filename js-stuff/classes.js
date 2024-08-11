
class Sprite{
    constructor({position, imageSrc}){
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
       
    }
    
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)    
    }

    update(){
     this.draw()
    }

 
}


class Fighter{
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

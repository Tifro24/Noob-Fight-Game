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


let timer = 60
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


// got rid of below as our players are no longer rectangles, but wanted to keep the code for understanding purposes.

// draw(){
//     c.fillStyle = this.color
//     c.fillRect(this.position.x, this.position.y, this.width, this.height)

//     // attack box
//     if(this.isAttacking){ // if statement to make it so that attack box only shows when is attacking is true
//         c.fillStyle = "blue"
//         c.fillRect(
//         this.attackBox.position.x,
//         this.attackBox.position.y, 
//         this.attackBox.width, 
//         this.attackBox.height)
//     }
    
// }

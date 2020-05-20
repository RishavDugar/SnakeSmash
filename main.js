const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var x = window.matchMedia("(max-width: 600px)");

if(x.matches)
{   canvas.width = 320;
    canvas.height = 320;
}
else
{   canvas.width = 480;
    canvas.height = 480;
}


var box;

if(x.matches)
{   box = 15;
}
else
{   box = 30;
}

var touchInfo = 0;

if ("ontouchstart" in document.documentElement)
{
    touchInfo = 1;
}


var foodImg = new Array();

foodImg[0] = new Image();
foodImg[0].src="img/apple.png";
foodImg[1] = new Image();
foodImg[1].src="img/cherry.png";
foodImg[2] = new Image();
foodImg[2].src="img/orange.png";

var f = Math.floor(Math.random() * 3);

let snake = [];
snake[0] = {
    x: 7 * box,
    y: 7 * box
}

let food ={
    x: Math.floor(Math.random()*16) * box,
    y: Math.floor(Math.random()*16) * box
}

function foodonsnake(foodX,foodY){
    //let foodCheck = 0;
    for(let i=0;i<snake.length;i++){
        if(foodX == snake[i].x && foodY == snake[i].y)
        {   food ={
                x: Math.floor(Math.random()*16) * box,
                y: Math.floor(Math.random()*16) * box
            }
            foodonsnake(food.x,food.y);
        }
    }

}

foodonsnake(food.x,food.y);



let score = 0;

let d = 0;


function eventListenerType(){
    document.addEventListener("keydown",advanceSnake);
}


function eventListenerTouch(el, callback){
  
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)
  
    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)
  
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}


    
let snakeX=snake[0].x;

let snakeY=snake[0].y;

function drawSnake(){
    for( let i = 0; i<snake.length; i++){
        ctx.fillStyle = "yellowgreen";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
    }
}


function didSnakeEat(){
    if(snakeX == food.x && snakeY == food.y){
        score=score+10;
        document.getElementById("score").innerHTML = score;
        f = Math.floor(Math.random() * 3);
        food = {
            x: Math.floor(Math.random()*16) * box,
            y: Math.floor(Math.random()*16) * box
        }
        foodonsnake(food.x,food.y);

    }
    else
    {    snake.pop();

    }
}

function collision(){
    var flag=0;

    for( let i = 3; i<snake.length; i++){
        if(snakeX == snake[i].x && snakeY == snake[i].y)
        {   return true;
            flag=1;
        }
    }

    return false;

}

function didSnakeCollide(){
    if((snakeX < 0) || (snakeX > (15 * box)) || (snakeY < 0) || (snakeY > (15 * box)) || collision())
    {    clearInterval(game);
         alert("GAME OVER!");
    }
}

function translator(d){
    if(d==37)
        snakeX=snakeX-box;
    if(d==38)
        snakeY=snakeY-box;
    if(d==39)
        snakeX=snakeX+box;
    if(d==40)
        snakeY=snakeY+box;


    var newSnakeHead = {
        x : snakeX,
        y : snakeY
    }

    snake.unshift(newSnakeHead);

        
    didSnakeEat();

    didSnakeCollide();

    drawSnake();
}

function advanceSnake(event){
    var num=event.keyCode;
    if(num==37 && d!=39)
        {d=37;
        translator(d);
    }
    else if(num==38 && d!=40)
        {d=38;
        translator(d);
    }
    else if(num==39 && d!=37)
        {d=39;
        translator(d);
    }
    else if(num==40 && d!=38)
        {d=40;
        translator(d);
    }

}

function advanceSnakeByTouch(swipedir){
    
    if(swipedir=="left" && d!=39)
        {d=37;
        translator(d);
    }
    else if(swipedir=="up" && d!=40)
        {d=38;
        translator(d);
    }
    else if(swipedir=="right" && d!=37)
        {d=39;
        translator(d);
    }
    else if(swipedir=="down" && d!=38)
        {d=40;
        translator(d);
    }

}

var grassBG =new Image();
grassBG.src="img/grass.jpg";

function draw(){

    ctx.drawImage(grassBG,0,0,480,480);

    drawSnake();

    ctx.drawImage(foodImg[f],food.x,food.y,box,box);


    if( touchInfo == 0)
        {   eventListenerType();}
    else if (touchInfo == 1)
    {   
        eventListenerTouch(canvas,function(swipedir){
            advanceSnakeByTouch(swipedir)
        })
    }
}

let game = setInterval(draw,50);

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballR = canvas.width/45;

var squareSize = canvas.width/40;
var dxy;
var squares = new Array;
var balls = new Array;

var highScores = [
    { name: '', score: 0 },
    { name: '', score: 0 },
    { name: '', score: 0 }
];

var name;
var timeLeft = 1800;


var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var enterPressed = false;

var ballColor = new Array("darkblue", "blue", "cyan");
var cColor = 0;

var squareCycle = 15;

var score = 0;

var dummyExists = false;

var currScore = document.getElementById('currScore');
var highScore = document.getElementById('highScore');

class Square {
    constructor(options) {
        this.options = options;
        this.x = options.x;
        this.y = options.y;
        this.counter = 20;
    }

    drawIt() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, squareSize, squareSize);
        if(this.counter > 0) {
            ctx.fillStyle = "green";
        }
        else if(this.counter < 0) {
            ctx.fillStyle = "red";
        }
        else {
            ctx.fillStyle = "gray";
        }        
        ctx.fill();
        ctx.closePath();

        ctx.font = squareSize*85/100 + "px Arial";
        ctx.fillStyle = "white";
        if(Math.abs(this.counter) < 10) {
            ctx.fillText(Math.abs(this.counter), this.x + squareSize/4, this.y + squareSize*19/24);
        }
        else {
            ctx.fillText(Math.abs(this.counter), this.x, this.y + squareSize*19/24);
        }
        
        if(counter%(squareCycle*3) == 0 && counter != 0) {
            this.counter--;
        }
    }
}

class Ball {
    constructor(options) {
        this.options = options;
        this.x = options.x;
        this.y = options.y;
        this.oldX = this.x;
        this.oldY = this.y;
    }

    drawIt() {
        if(upPressed||downPressed||rightPressed||leftPressed) {
            ctx.globalAlpha = 0.33333;
            ctx.beginPath();
            ctx.arc(this.oldXX, this.oldYY, ballR, 0, Math.PI*2);
            ctx.fillStyle = ballColor[cColor];
            ctx.fill();
            ctx.closePath();

            ctx.globalAlpha = 0.66666;
            ctx.beginPath();
            ctx.arc(this.oldX, this.oldY, ballR, 0, Math.PI*2);
            ctx.fillStyle = ballColor[cColor];
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, ballR, 0, Math.PI*2);
        ctx.fillStyle = ballColor[cColor];
        ctx.fill();
        ctx.closePath();
    }

    
    updateOld() {
        this.oldXX = this.oldX;
        this.oldYY = this.oldY;
        this.oldX = this.x;
        this.oldY = this.y;
    }
}

balls.push(new Ball(
    {
        x: canvas.width/2,
        y: canvas.height/2
    }
));


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    else if(e.key == "Enter") {
        dxy = canvas.width/80;
        timeLeft = 1800;
        cColor = 0;
        counter = 0;
        squareCycle = 15;
        score = 0;
        dummyExists = false;
        balls.splice(1);
        balls[0].x = canvas.width/2;
        balls[0].y = canvas.height/2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        squares = [];
        for(var i = 0; i < 20; i++) {
            do {
                var x = Math.floor((Math.random() * (canvas.width - squareSize)));
                var y = Math.floor((Math.random() * (canvas.width - squareSize)));
            } while(squareOnSquare(x, y) || squareOnBall(x, y));
    
            squares.push(new Square(
                {
                    x: x,
                    y: y
                }
            ));
        }        

        update();
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
}

function squareOnSquare(rectX, rectY) {
    for(var i = 0; i < squares.length; i++) {
        if(Math.sqrt((rectX-squares[i].x)**2+(rectY-squares[i].y)**2) < (Math.sqrt(2)*squareSize)) {
            return true;
        }
    }

    return false;
}

function squareOnBall(rectX, rectY) {
    for(var i = 0; i < balls.length; i++) {
        if(Math.sqrt((rectX+squareSize/2-balls[i].x)**2+(rectY+squareSize/2-balls[i].y)**2) < (Math.sqrt(2)*squareSize/2+ballR)) {
            return true;
        }
    }
    
    return false;
}

function checkCollision(rectX, rectY) {
    for(var i = 0; i < balls.length; i++) {
        if(((Math.sqrt((balls[i].x-rectX-squareSize/2)**2+(balls[i].y-rectY-squareSize/2)**2)) <= (ballR+squareSize/2*Math.sqrt(2))) &&
            ((Math.abs(balls[i].x-rectX-squareSize/2) > Math.abs(balls[i].y-rectY-squareSize/2)) &&
                ((Math.abs(balls[i].x - (rectX+squareSize/2)) <= squareSize/2+ballR) &&
                (Math.abs(balls[i].y - (rectY+squareSize/2)) <= squareSize/2*Math.sqrt(2)+ballR))) ||
            ((Math.abs(balls[i].x-rectX-squareSize/2) <= Math.abs(balls[i].y-rectY-squareSize/2)) &&
                ((Math.abs(balls[i].y - (rectY+squareSize/2)) <= squareSize/2+ballR) &&
                (Math.abs(balls[i].x - (rectX+squareSize/2)) <= squareSize/2*Math.sqrt(2)+ballR)))) {

            return true
        }
    }
    
    return false;
}



var counter = 0;

function update() {
    currScore.rows[1].cells[0].innerHTML = score;
    currScore.rows[1].cells[1].innerHTML = Math.floor(timeLeft/60);

    balls.splice(1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //sq

    if((counter % squareCycle == 0) && squares.length < 200) {

        do {
            var x = Math.floor((Math.random() * (canvas.width - squareSize)));
            var y = Math.floor((Math.random() * (canvas.width - squareSize)));
        } while(squareOnSquare(x, y) || squareOnBall(x, y));

        squares.push(new Square(
            {
                x: x,
                y: y
            }
        ));
    }

    for(var i = 0; i < squares.length; i++) {
        if(squares[i].counter == -21) {
            squares.splice(i, 1);
        } else {
            if(checkCollision(squares[i].x, squares[i].y)) {
                score += squares[i].counter;
                squares.splice(i, 1);
            }
            else { 
                squares[i].drawIt();
            }
        }
    }

    counter++;

    //b

    for(var i = 0; i < balls.length; i++) {
        balls[i].updateOld();
    }

    if(rightPressed) {
        if(upPressed) {
            balls[0].y -= dxy/Math.sqrt(2);
            balls[0].x += dxy/Math.sqrt(2);
        }
        else if(downPressed) {
            balls[0].y += dxy/Math.sqrt(2);
            balls[0].x += dxy/Math.sqrt(2);
        }
        else {
            balls[0].x += dxy;
        }
        
    }
    else if(leftPressed) {
        if(upPressed) {
            balls[0].y -= dxy/Math.sqrt(2);
            balls[0].x -= dxy/Math.sqrt(2);
        }
        else if(downPressed) {
            balls[0].y += dxy/Math.sqrt(2);
            balls[0].x -= dxy/Math.sqrt(2);
        }
        else {
            balls[0].x -= dxy;
        }
        
    }
    else if(upPressed) {
        balls[0].y -= dxy;
    }
    else if(downPressed) {
        balls[0].y += dxy;
    }

    if((balls[0].x + ballR > canvas.width) && (balls[0].y + ballR > canvas.height)) {
        balls.push(new Ball(
            {
                x: -canvas.width + balls[0].x,
                y: -canvas.width + balls[0].y
            }
        ));
    }
    else if((balls[0].x + ballR > canvas.width) && (balls[0].y - ballR < 0)) {
        balls.push(new Ball(
            {
                x: -canvas.width + balls[0].x,
                y: canvas.height + balls[0].y
            }
        ));
    }

    if((balls[0].x - ballR < 0) && (balls[0].y + ballR > canvas.height)) {
        balls.push(new Ball(
            {
                x: canvas.width + balls[0].x,
                y: -canvas.width + balls[0].y
            }
        ));
    }
    else if((balls[0].x - ballR < 0) && (balls[0].y - ballR < 0)) {
        balls.push(new Ball(
            {
                x: canvas.width + balls[0].x,
                y: canvas.height + balls[0].y
            }
        ));
    }


    if(balls[0].x + ballR > canvas.width) {
        balls.push(new Ball(
            {
                x: -canvas.width + balls[0].x,
                y: balls[0].y
            }
        ));

        if(balls[0].x - ballR > canvas.width) {
            balls[0].x = ballR;
        }
    }
    else if(balls[0].x - ballR < 0) {
        balls.push(new Ball(
            {
                x: canvas.width + balls[0].x,
                y: balls[0].y
            }
        ));

        if(balls[0].x + ballR < 0) {
            balls[0].x = canvas.width - ballR;
        }
    }
    
    if(balls[0].y + ballR > canvas.height) {
        balls.push(new Ball(
            {
                x: balls[0].x,
                y: -canvas.width + balls[0].y
            }
        ));

        if(balls[0].y - ballR > canvas.height) {
            balls[0].y = ballR;
        }
    }
    else if(balls[0].y - ballR < 0) {
        balls.push(new Ball(
            {
                x: balls[0].x,
                y: canvas.width + balls[0].y
            }
        ));

        if(balls[0].y + ballR < 0) {
            balls[0].y = canvas.height - ballR;
        }
    }
    

    for(var i = 0; i < balls.length; i++) {
        balls[i].drawIt();
    }

    timeLeft--;

    if(timeLeft == 1200 || timeLeft == 600) {
        dxy *= 1.25;
        squareCycle -= 5;
        cColor++;
        requestAnimationFrame(update);
    }
    else if(timeLeft == 0) {
        ctx.font = canvas.width/5 + "px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("PRESS", canvas.width*2/15, canvas.height*6/15);
        ctx.fillText("ENTER", canvas.width*2/15, canvas.height*10/15);
        name = document.getElementById("name").value;

        for(var i = 0; i < highScores.length; i++) {
            if(highScores[i].score < score) {
                var tempName = highScores[i].name;
                var tempScore = highScores[i].score;
                highScores[i].name = name;
                highScores[i].score = score;
                name = tempName;
                score = tempScore;
            }
        }

        for(var i = 0; i < highScores.length; i++) {
            highScore.rows[i+1].cells[0].innerHTML = highScores[i].name;
            highScore.rows[i+1].cells[1].innerHTML = highScores[i].score;
        }

        cancelAnimationFrame(update);
    }
    else {
        requestAnimationFrame(update);
    }
}

ctx.font = canvas.width/5 + "px Arial";
ctx.fillStyle = "red";
ctx.fillText("PRESS", canvas.width*2/15, canvas.height*6/15);
ctx.fillText("ENTER", canvas.width*2/15, canvas.height*10/15);

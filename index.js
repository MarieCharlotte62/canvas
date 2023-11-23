// // jeu casse brique
let canvas = document.querySelector("#canvas");
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

// // score
let score = 0;

// // nombre de vies
let lives = 3;
// // optimisation dimensions briques
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c=0; c<brickColumnCount; c++) {
bricks[c] = [];
    for (let r=0; r<brickRowCount;r++) {
        bricks[c][r] = {x: 0, y:0, status: 1};
    }
}

function collisionDetection() {
    for (let c=0; c<brickColumnCount; c++) {
        for (let r=0; r<brickRowCount;r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x>b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++
                    if(score === brickColumnCount * brickRowCount) {
                        alert("Bravo, c'est gagné!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

// // dessin texte du score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

// // dessin texte nombre de vies 
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("Vie: " + lives, canvas.width - 65, 20);
}

function drawBrick() {
    for (let c = 0; c<brickColumnCount; c++) {
        for (let r=0; r<brickRowCount;r++) {
            if (bricks[c][r].status === 1) {

            let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "0095DD";
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

let paddleHeight = 10;
let paddleWidth = 70;
let paddleX = (canvas.width - paddleWidth) / 2;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

let rightPressed = false;
let leftPressed = false;

let ctx = canvas.getContext("2d");
// // écoute évènement sur les touches droite et gauche du clavier
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// // écoute mouvement de la souris
document.addEventListener("mousemove", mouseMoveHandler, false);

// // fonction mouvement de la souris
function mouseMoveHandler(e) {
let relativeX = e.clientX - canvas.offsetLeft;
if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
}
}

// // fonction touche appuyée
function keyDownHandler(e) {
if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = true;
} else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = true;
}
}

// // fonction touche relevée
function keyUpHandler(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = false;
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = false;
    }
    }

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD"
    ctx.fill();
    ctx.closePath();
}

function draw() {
    if (canvas.getContext) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // call back
        drawBall(); 
        drawPaddle(); 
        drawBrick();
        collisionDetection();
        drawScore();
        drawLives();

        // rebond haut et bas
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    alert("Game Over");
                    document.location.reload();
                    clearInterval(interval);
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        
        // rebond droite et gauche
        if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
            dx = -dx;
        }

        if (rightPressed) {
            paddleX += 7;
            if (paddleX + paddleWidth > canvas.width) {
                paddleX = canvas.width - paddleWidth;
            }
        } else if (leftPressed) {
            paddleX -= 7;
            if (paddleX < 0) {
                paddleX = 0;
            }
        }
        x += dx; // x=x+dx
        y += dy;
    }
    requestAnimationFrame(draw);
}

// relance la fonction toute les x milisecondes
// let interval = setInterval(draw, 10);
draw();
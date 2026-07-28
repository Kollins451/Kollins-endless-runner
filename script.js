// ==========================
// ELEMENTS
// ==========================

const player =
document.getElementById("player");

const obstacle =
document.getElementById("obstacle");

const train =
document.getElementById("train");

const coins =
document.querySelectorAll(".coin");

const scoreDisplay =
document.getElementById("score");

const topScoreDisplay =
document.getElementById("topScore");

const startScreen =
document.getElementById("startScreen");

const startButton =
document.getElementById("startButton");

const gameOverScreen =
document.getElementById("gameOverScreen");

const finalScore =
document.getElementById("finalScore");

const bestScore =
document.getElementById("bestScore");

const restartButton =
document.getElementById("restartButton");


// ==========================
// GAME VARIABLES
// ==========================

let lane = 1;

let score = 0;

let gameSpeed = 5;

let obstaclePosition = -60;

let trainPosition = -250;

let coinPosition = -60;

let isJumping = false;

let gameStarted = false;

let gameOverState = false;


// ==========================
// TOUCH VARIABLES
// ==========================

let touchStartX = 0;

let touchStartY = 0;


// ==========================
// LANES
// ==========================

const lanes = [
"16.66%",
"50%",
"83.33%"
];


// ==========================
// HIGH SCORE
// ==========================

let highScore =
Number(
localStorage.getItem(
"endlessRunnerHighScore"
)
) || 0;


topScoreDisplay.textContent =
highScore;


// ==========================
// START GAME
// ==========================

startButton.addEventListener(
"click",
function() {

startScreen.style.display =
"none";

gameStarted = true;

setCoinsLane();

moveGame();

}
);


// ==========================
// RESTART GAME
// ==========================

restartButton.addEventListener(
"click",
function() {

location.reload();

}
);


// ==========================
// SET COINS LANE
// ==========================

function setCoinsLane() {

const randomLane =
Math.floor(
Math.random() * 3
);


coins.forEach(
function(coin) {

coin.style.left =
lanes[randomLane];

coin.style.visibility =
"visible";

}
);

}


// ==========================
// KEYBOARD CONTROLS
// ==========================

document.addEventListener(
"keydown",
function(event) {

if (
!gameStarted ||
gameOverState
) {

return;

}


// LEFT

if (
event.key ===
"ArrowLeft"
) {

moveLeft();

}


// RIGHT

if (
event.key ===
"ArrowRight"
) {

moveRight();

}


// JUMP

if (
event.key ===
"ArrowUp"
) {

jump();

}

}
);


// ==========================
// MOVE LEFT
// ==========================

function moveLeft() {

if (lane > 0) {

lane--;

player.style.left =
lanes[lane];

}

}


// ==========================
// MOVE RIGHT
// ==========================

function moveRight() {

if (lane < 2) {

lane++;

player.style.left =
lanes[lane];

}

}


// ==========================
// MOBILE TOUCH START
// ==========================

document.addEventListener(
"touchstart",
function(event) {

if (
!gameStarted ||
gameOverState
) {

return;

}


const touch =
event.touches[0];


touchStartX =
touch.clientX;


touchStartY =
touch.clientY;

},
{
passive: true
}
);


// ==========================
// MOBILE SWIPE
// ==========================

document.addEventListener(
"touchend",
function(event) {

if (
!gameStarted ||
gameOverState
) {

return;

}


const touch =
event.changedTouches[0];


const touchEndX =
touch.clientX;


const touchEndY =
touch.clientY;


const differenceX =
touchEndX -
touchStartX;


const differenceY =
touchEndY -
touchStartY;


// SWIPE LEFT

if (
Math.abs(
differenceX
) >
Math.abs(
differenceY
) &&
differenceX < -50
) {

moveLeft();

}


// SWIPE RIGHT

if (
Math.abs(
differenceX
) >
Math.abs(
differenceY
) &&
differenceX > 50
) {

moveRight();

}


// SWIPE UP

if (
Math.abs(
differenceY
) >
Math.abs(
differenceX
) &&
differenceY < -50
) {

jump();

}

},
{
passive: true
}
);


// ==========================
// JUMP
// ==========================

function jump() {

if (
isJumping ||
!gameStarted ||
gameOverState
) {

return;

}


isJumping = true;


player.style.bottom =
"200px";


setTimeout(
function() {

player.style.bottom =
"80px";

isJumping = false;

},
500
);

}


// ==========================
// MAIN GAME LOOP
// ==========================

function moveGame() {

if (
!gameStarted ||
gameOverState
) {

return;

}


// ==========================
// OBSTACLE
// ==========================

obstaclePosition +=
gameSpeed;


obstacle.style.top =
obstaclePosition + "px";


if (
obstaclePosition >
700
) {

obstaclePosition =
-60;


const randomLane =
Math.floor(
Math.random() * 3
);


obstacle.style.left =
lanes[randomLane];

}


// ==========================
// TRAIN
// ==========================

trainPosition +=
gameSpeed;


train.style.top =
trainPosition + "px";


if (
trainPosition >
700
) {

trainPosition =
-250;


const randomLane =
Math.floor(
Math.random() * 3
);


train.style.left =
lanes[randomLane];

}


// ==========================
// COINS
// ==========================

coinPosition +=
gameSpeed;


coins.forEach(
function(
coin,
index
) {

coin.style.top =
(
coinPosition +
index * 70
) + "px";

}
);


if (
coinPosition >
700
) {

coinPosition =
-60;


setCoinsLane();

}


// ==========================
// COLLISIONS
// ==========================

checkObstacleCollision();

checkTrainCollision();

collectCoins();


// ==========================
// INCREASE SPEED
// ==========================

if (
score > 0 &&
score % 50 === 0
) {

gameSpeed =
5 +
Math.floor(
score / 50
);

}


requestAnimationFrame(
moveGame
);

}


// ==========================
// OBSTACLE COLLISION
// ==========================

function checkObstacleCollision() {

const playerRect =
player.getBoundingClientRect();


const obstacleRect =
obstacle.getBoundingClientRect();


if (

playerRect.left <
obstacleRect.right &&

playerRect.right >
obstacleRect.left &&

playerRect.top <
obstacleRect.bottom &&

playerRect.bottom >
obstacleRect.top &&

!isJumping

) {

gameOver();

}

}


// ==========================
// TRAIN COLLISION
// ==========================

function checkTrainCollision() {

const playerRect =
player.getBoundingClientRect();


const trainRect =
train.getBoundingClientRect();


if (

playerRect.left <
trainRect.right &&

playerRect.right >
trainRect.left &&

playerRect.top <
trainRect.bottom &&

playerRect.bottom >
trainRect.top &&

!isJumping

) {

gameOver();

}

}


// ==========================
// COLLECT COINS
// ==========================

function collectCoins() {

const playerRect =
player.getBoundingClientRect();


coins.forEach(
function(coin) {

if (
coin.style.visibility ===
"hidden"
) {

return;

}


const coinRect =
coin.getBoundingClientRect();


if (

playerRect.left <
coinRect.right &&

playerRect.right >
coinRect.left &&

playerRect.top <
coinRect.bottom &&

playerRect.bottom >
coinRect.top

) {

score += 10;


scoreDisplay.textContent =
score;


coin.style.visibility =
"hidden";

}

}
);

}


// ==========================
// GAME OVER
// ==========================

function gameOver() {

if (gameOverState) {

return;

}


gameOverState =
true;


// Save high score

if (
score >
highScore
) {

highScore =
score;


localStorage.setItem(
"endlessRunnerHighScore",
highScore
);

}


// Show scores

finalScore.textContent =
score;


bestScore.textContent =
highScore;


topScoreDisplay.textContent =
highScore;


// Show game over screen

gameOverScreen.style.display =
"flex";

}

/* ==================================================
SHADOW RUN — AUTO START ENDLESS RUNNER
================================================== */


/* ==================================================
GET GAME ELEMENTS
================================================== */

const game = document.getElementById("game");

const startScreen =
document.getElementById("startScreen");

const gameOverScreen =
document.getElementById("gameOverScreen");

const startButton =
document.getElementById("startButton");

const restartButton =
document.getElementById("restartButton");

const player =
document.getElementById("player");

const pursuer =
document.getElementById("pursuer");

const objects =
document.getElementById("objects");

const collectibles =
document.getElementById("collectibles");

const scoreDisplay =
document.getElementById("score");

const distanceDisplay =
document.getElementById("distance");

const finalScoreDisplay =
document.getElementById("finalScore");

const finalDistanceDisplay =
document.getElementById("finalDistance");

const bestScoreDisplay =
document.getElementById("bestScore");

const energyFill =
document.getElementById("energyFill");

const moveLeftButton =
document.getElementById("moveLeft");

const moveRightButton =
document.getElementById("moveRight");

const jumpButton =
document.getElementById("jump");

const soundButton =
document.getElementById("soundButton");


/* ==================================================
GAME VARIABLES
================================================== */

let gameRunning = false;

let score = 0;

let distance = 0;

let energy = 100;

let speed = 5;

let currentLane = 1;

let isJumping = false;

let jumpHeight = 0;

let jumpVelocity = 0;

let pursuerProgress = 0;

let animationFrame = null;

let obstacleTimer = null;

let collectibleTimer = null;

let distanceTimer = null;

let difficultyTimer = null;

let soundEnabled = true;

let audioContext = null;


/* ==================================================
LANES
================================================== */

const lanes = [
25,
50,
75
];


/* ==================================================
BEST SCORE
================================================== */

let bestScore =
Number(
localStorage.getItem(
"shadowRunBest"
)
) || 0;

if (bestScoreDisplay) {

bestScoreDisplay.textContent =
bestScore;

}


/* ==================================================
AUDIO
================================================== */

function startAudio() {

if (!soundEnabled) {
return;
}

if (!audioContext) {

audioContext =
new (
window.AudioContext ||
window.webkitAudioContext
)();

}

if (
audioContext.state ===
"suspended"
) {

audioContext.resume();

}

}


/* ==================================================
SOUND EFFECT
================================================== */

function playSound(
frequency,
duration,
type = "sine"
) {

if (
!soundEnabled ||
!audioContext
) {

return;

}

const oscillator =
audioContext.createOscillator();

const gain =
audioContext.createGain();


oscillator.type =
type;

oscillator.frequency.value =
frequency;


gain.gain.setValueAtTime(
0.08,
audioContext.currentTime
);


gain.gain.exponentialRampToValueAtTime(
0.001,
audioContext.currentTime +
duration
);


oscillator.connect(
gain
);

gain.connect(
audioContext.destination
);


oscillator.start();

oscillator.stop(
audioContext.currentTime +
duration
);

}


/* ==================================================
PLAYER POSITION
================================================== */

function updatePlayerPosition() {

if (!player) {
return;
}

player.style.left =
lanes[currentLane] + "%";

}


/* ==================================================
MOVE LEFT
================================================== */

function moveLeft() {

if (!gameRunning) {
return;
}

if (
currentLane >
0
) {

currentLane--;

updatePlayerPosition();

playSound(
280,
0.08
);

}

}


/* ==================================================
MOVE RIGHT
================================================== */

function moveRight() {

if (!gameRunning) {
return;
}

if (
currentLane <
lanes.length - 1
) {

currentLane++;

updatePlayerPosition();

playSound(
320,
0.08
);

}

}


/* ==================================================
JUMP
================================================== */

function jump() {

if (
!gameRunning ||
isJumping
) {

return;

}

isJumping =
true;

jumpVelocity =
15;

playSound(
550,
0.12
);

}


/* ==================================================
JUMP PHYSICS
================================================== */

function updateJump() {

if (!isJumping) {
return;
}

jumpHeight +=
jumpVelocity;

jumpVelocity -=
0.8;


if (
jumpHeight <=
0
) {

jumpHeight =
0;

jumpVelocity =
0;

isJumping =
false;

}


if (player) {

player.style.bottom =
(
110 +
jumpHeight
) + "px";

}

}


/* ==================================================
CREATE OBSTACLE
================================================== */

function createObstacle() {

if (
!gameRunning ||
!objects
) {

return;

}


const obstacle =
document.createElement(
"div"
);


obstacle.className =
"game-object";


const vehicle =
Math.random() >
0.5;


if (vehicle) {

obstacle.classList.add(
"vehicle"
);

} else {

obstacle.classList.add(
"obstacle"
);

}


const lane =
Math.floor(
Math.random() * 3
);


obstacle.dataset.lane =
lane;


obstacle.style.left =
lanes[lane] + "%";


obstacle.style.top =
"-120px";


objects.appendChild(
obstacle
);

}


/* ==================================================
CREATE COIN
================================================== */

function createCollectible() {

if (
!gameRunning ||
!collectibles
) {

return;

}


const coin =
document.createElement(
"div"
);


coin.className =
"game-object collectible";


const lane =
Math.floor(
Math.random() * 3
);


coin.dataset.lane =
lane;


coin.style.left =
lanes[lane] + "%";


coin.style.top =
"-60px";


collectibles.appendChild(
coin
);

}


/* ==================================================
MOVE OBSTACLES AND COINS
================================================== */

function updateObjects() {

if (!gameRunning) {
return;
}


/* OBSTACLES */

if (objects) {

const obstacles =
objects.querySelectorAll(
".game-object"
);


obstacles.forEach(
obstacle => {

let top =
parseFloat(
obstacle.style.top
);


top +=
speed;


obstacle.style.top =
top + "px";


checkObstacleCollision(
obstacle,
top
);


if (
top >
window.innerHeight +
150
) {

obstacle.remove();

}

}
);

}


/* COINS */

if (collectibles) {

const coins =
collectibles.querySelectorAll(
".game-object"
);


coins.forEach(
coin => {

let top =
parseFloat(
coin.style.top
);


top +=
speed;


coin.style.top =
top + "px";


checkCoinCollision(
coin,
top
);


if (
top >
window.innerHeight +
100
) {

coin.remove();

}

}
);

}

}


/* ==================================================
OBSTACLE COLLISION
================================================== */

function checkObstacleCollision(
obstacle,
top
) {

const lane =
Number(
obstacle.dataset.lane
);


if (
lane !==
currentLane
) {

return;

}


const screenHeight =
window.innerHeight;


const playerZone =
screenHeight -
top;


if (
playerZone >
70 &&

playerZone <
220
) {

if (
!isJumping
) {

hitObstacle(
obstacle
);

}

}

}


/* ==================================================
HIT OBSTACLE
================================================== */

function hitObstacle(
obstacle
) {

if (
obstacle.dataset.hit ===
"true"
) {

return;

}


obstacle.dataset.hit =
"true";


obstacle.remove();


energy -=
25;


pursuerProgress +=
20;


updateEnergy();


playSound(
90,
0.4,
"sawtooth"
);


updatePursuer();


if (
energy <=
0
) {

energy =
0;

endGame();

}

}


/* ==================================================
COIN COLLISION
================================================== */

function checkCoinCollision(
coin,
top
) {

const lane =
Number(
coin.dataset.lane
);


if (
lane !==
currentLane
) {

return;

}


const screenHeight =
window.innerHeight;


const playerZone =
screenHeight -
top;


if (
playerZone >
60 &&

playerZone <
220
) {

collectCoin(
coin
);

}

}


/* ==================================================
COLLECT COIN
================================================== */

function collectCoin(
coin
) {

if (
coin.dataset.collected ===
"true"
) {

return;

}


coin.dataset.collected =
"true";


coin.remove();


score +=
50;


energy +=
5;


if (
energy >
100
) {

energy =
100;

}


updateScore();

updateEnergy();


/* Coin sound */

playSound(
800,
0.15,
"sine"
);

}


/* ==================================================
SCORE
================================================== */

function updateScore() {

if (scoreDisplay) {

scoreDisplay.textContent =
score;

}

}


/* ==================================================
ENERGY
================================================== */

function updateEnergy() {

if (energyFill) {

energyFill.style.width =
energy + "%";

}

}


/* ==================================================
DISTANCE
================================================== */

function updateDistance() {

if (!gameRunning) {
return;
}


distance +=
1;


score +=
2;


if (distanceDisplay) {

distanceDisplay.textContent =
distance +
" m";

}


updateScore();

}


/* ==================================================
PURSUER
================================================== */

function updatePursuer() {

if (
!gameRunning ||
!pursuer
) {

return;

}


const scale =
0.72 +
(
pursuerProgress /
100
) *
0.35;


pursuer.style.transform =
`translateX(-50%) scale(${scale})`;


if (
pursuerProgress >=
100
) {

endGame();

}

}


/* ==================================================
DIFFICULTY
================================================== */

function increaseDifficulty() {

if (!gameRunning) {
return;
}


speed +=
0.4;


if (
speed >
12
) {

speed =
12;

}

}


/* ==================================================
GAME LOOP
================================================== */

function gameLoop() {

if (!gameRunning) {
return;
}


updateJump();

updateObjects();


animationFrame =
requestAnimationFrame(
gameLoop
);

}


/* ==================================================
START GAME
================================================== */

function startGame() {

console.log(
"SHADOW RUN STARTED"
);


gameRunning =
true;


/* Reset values */

score =
0;

distance =
0;

energy =
100;

speed =
5;

currentLane =
1;

isJumping =
false;

jumpHeight =
0;

jumpVelocity =
0;

pursuerProgress =
0;


/* Start audio */

startAudio();


/* Reset player */

updatePlayerPosition();


if (player) {

player.style.bottom =
"110px";

}


/* Reset pursuer */

if (pursuer) {

pursuer.style.transform =
"translateX(-50%) scale(0.72)";

}


/* Reset display */

updateScore();

updateEnergy();


if (distanceDisplay) {

distanceDisplay.textContent =
"0 m";

}


/* Clear old objects */

if (objects) {

objects.innerHTML =
"";

}


if (collectibles) {

collectibles.innerHTML =
"";

}


/* Hide start screen */

if (startScreen) {

startScreen.classList.add(
"hidden"
);

}


/* Hide game over */

if (gameOverScreen) {

gameOverScreen.classList.add(
"hidden"
);

}


/* Clear old timers */

clearInterval(
obstacleTimer
);

clearInterval(
collectibleTimer
);

clearInterval(
distanceTimer
);

clearInterval(
difficultyTimer
);


/* Start spawning obstacles */

obstacleTimer =
setInterval(
createObstacle,
1300
);


/* Start spawning coins */

collectibleTimer =
setInterval(
createCollectible,
1700
);


/* Distance counter */

distanceTimer =
setInterval(
updateDistance,
500
);


/* Difficulty */

difficultyTimer =
setInterval(
increaseDifficulty,
10000
);


/* Start animation */

cancelAnimationFrame(
animationFrame
);


gameLoop();

}


/* ==================================================
END GAME
================================================== */

function endGame() {

if (!gameRunning) {
return;
}


gameRunning =
false;


cancelAnimationFrame(
animationFrame
);


clearInterval(
obstacleTimer
);


clearInterval(
collectibleTimer
);


clearInterval(
distanceTimer
);


clearInterval(
difficultyTimer
);


/* Final score */

if (finalScoreDisplay) {

finalScoreDisplay.textContent =
score;

}


/* Final distance */

if (finalDistanceDisplay) {

finalDistanceDisplay.textContent =
distance +
" m";

}


/* Save best score */

if (
score >
bestScore
) {

bestScore =
score;


localStorage.setItem(
"shadowRunBest",
bestScore
);

}


if (bestScoreDisplay) {

bestScoreDisplay.textContent =
bestScore;

}


/* Show game over */

if (gameOverScreen) {

gameOverScreen.classList.remove(
"hidden"
);

}


playSound(
70,
0.7,
"sawtooth"
);

}


/* ==================================================
KEYBOARD CONTROLS
================================================== */

document.addEventListener(
"keydown",
event => {


if (
event.key ===
"ArrowLeft" ||

event.key.toLowerCase() ===
"a"
) {

moveLeft();

}


if (
event.key ===
"ArrowRight" ||

event.key.toLowerCase() ===
"d"
) {

moveRight();

}


if (
event.key ===
"ArrowUp" ||

event.key ===
" " ||

event.key.toLowerCase() ===
"w"
) {

event.preventDefault();

jump();

}

}
);


/* ==================================================
MOBILE BUTTONS
================================================== */

if (moveLeftButton) {

moveLeftButton.addEventListener(
"click",
moveLeft
);

}


if (moveRightButton) {

moveRightButton.addEventListener(
"click",
moveRight
);

}


if (jumpButton) {

jumpButton.addEventListener(
"click",
jump
);

}


/* ==================================================
SWIPE CONTROLS
================================================== */

let touchStartX =
0;

let touchStartY =
0;


if (game) {

game.addEventListener(
"touchstart",
event => {

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


game.addEventListener(
"touchend",
event => {

if (!gameRunning) {
return;
}


const touch =
event.changedTouches[0];


const touchEndX =
touch.clientX;


const touchEndY =
touch.clientY;


const deltaX =
touchEndX -
touchStartX;


const deltaY =
touchEndY -
touchStartY;


const minimumSwipe =
40;


/* Swipe left or right */

if (
Math.abs(deltaX) >
Math.abs(deltaY)
) {


if (
deltaX >
minimumSwipe
) {

moveRight();

}


else if (
deltaX <
-minimumSwipe
) {

moveLeft();

}

}


/* Swipe up to jump */

else if (
deltaY <
-minimumSwipe
) {

jump();

}

},
{
passive: true
}
);

}


/* ==================================================
SOUND BUTTON
================================================== */

if (soundButton) {

soundButton.addEventListener(
"click",
() => {


soundEnabled =
!soundEnabled;


if (
soundEnabled
) {

soundButton.textContent =
"SOUND ON";


startAudio();


} else {

soundButton.textContent =
"SOUND OFF";

}

}
);

}


/* ==================================================
OPTIONAL START BUTTON
If it exists, it can still start/restart
the game manually.
================================================== */

if (startButton) {

startButton.addEventListener(
"click",
startGame
);

}


if (restartButton) {

restartButton.addEventListener(
"click",
startGame
);

}


/* ==================================================
INITIAL SETUP
================================================== */

updatePlayerPosition();

updateEnergy();

updateScore();


/* ==================================================
AUTO START
================================================== */

window.addEventListener(
"load",
() => {

/* Hide start screen */

if (startScreen) {

startScreen.classList.add(
"hidden"
);

}


/* Start game automatically */

startGame();

}
);


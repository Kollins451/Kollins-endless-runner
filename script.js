/* =========================================
SHADOW RUN
CLEAN GAME JAVASCRIPT
========================================= */


/* =========================================
GET HTML ELEMENTS
========================================= */

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


/* =========================================
GAME VARIABLES
========================================= */

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

let animationFrame;

let obstacleTimer;

let collectibleTimer;

let distanceTimer;

let difficultyTimer;

let soundEnabled = true;

let audioContext = null;


/* =========================================
LANES
========================================= */

const lanes = [
25,
50,
75
];


/* =========================================
BEST SCORE
========================================= */

let bestScore =
Number(
localStorage.getItem(
"shadowRunBest"
)
) || 0;

bestScoreDisplay.textContent =
bestScore;


/* =========================================
SOUND SYSTEM
========================================= */

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


/* =========================================
PLAY SOUND
========================================= */

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


/* =========================================
MOVE PLAYER
========================================= */

function updatePlayerPosition() {

player.style.left =
lanes[currentLane] + "%";

}


/* =========================================
MOVE LEFT
========================================= */

function moveLeft() {

if (!gameRunning) {
return;
}

if (currentLane > 0) {

currentLane--;

updatePlayerPosition();

playSound(
280,
0.08
);

}

}


/* =========================================
MOVE RIGHT
========================================= */

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


/* =========================================
JUMP
========================================= */

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


/* =========================================
UPDATE JUMP
========================================= */

function updateJump() {

if (!isJumping) {
return;
}


jumpHeight +=
jumpVelocity;


jumpVelocity -=
0.8;


if (
jumpHeight <= 0
) {

jumpHeight =
0;

jumpVelocity =
0;

isJumping =
false;

}


player.style.bottom =
(
110 +
jumpHeight
) + "px";

}


/* =========================================
CREATE OBSTACLE
========================================= */

function createObstacle() {

if (!gameRunning) {
return;
}


const obstacle =
document.createElement(
"div"
);


obstacle.className =
"game-object";


const isVehicle =
Math.random() > 0.5;


if (isVehicle) {

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
"-100px";


objects.appendChild(
obstacle
);

}


/* =========================================
CREATE COLLECTIBLE
========================================= */

function createCollectible() {

if (!gameRunning) {
return;
}


const collectible =
document.createElement(
"div"
);


collectible.className =
"game-object collectible";


const lane =
Math.floor(
Math.random() * 3
);


collectible.dataset.lane =
lane;


collectible.style.left =
lanes[lane] + "%";


collectible.style.top =
"-50px";


collectibles.appendChild(
collectible
);

}


/* =========================================
MOVE GAME OBJECTS
========================================= */

function updateObjects() {


const gameObjects =
document.querySelectorAll(
"#objects .game-object"
);


gameObjects.forEach(
object => {

let top =
parseFloat(
object.style.top
);


top +=
speed;


object.style.top =
top + "px";


checkObstacleCollision(
object,
top
);


if (
top >
window.innerHeight +
150
) {

object.remove();

}

}
);


const coins =
document.querySelectorAll(
"#collectibles .game-object"
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


/* =========================================
OBSTACLE COLLISION
========================================= */

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


const collisionZone =
screenHeight -
top;


if (
collisionZone >
70 &&

collisionZone <
210
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


/* =========================================
HIT OBSTACLE
========================================= */

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


/* Pursuer gets closer */

updatePursuer();


if (
energy <= 0
) {

energy =
0;

endGame();

}

}


/* =========================================
COIN COLLISION
========================================= */

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


const collisionZone =
screenHeight -
top;


if (
collisionZone >
60 &&

collisionZone <
220
) {

collectCoin(
coin
);

}

}


/* =========================================
COLLECT COIN
========================================= */

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


/* =========================================
UPDATE SCORE
========================================= */

function updateScore() {

scoreDisplay.textContent =
score;

}


/* =========================================
UPDATE ENERGY
========================================= */

function updateEnergy() {

energyFill.style.width =
energy + "%";

}


/* =========================================
UPDATE DISTANCE
========================================= */

function updateDistance() {

if (!gameRunning) {
return;
}


distance +=
1;


score +=
2;


distanceDisplay.textContent =
distance +
" m";


updateScore();

}


/* =========================================
UPDATE PURSUER
========================================= */

function updatePursuer() {

if (!gameRunning) {
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


/* =========================================
INCREASE DIFFICULTY
========================================= */

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


/* =========================================
GAME LOOP
========================================= */

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


/* =========================================
START GAME
========================================= */

function startGame() {

console.log(
"SHADOW RUN STARTED"
);


/* Start browser audio */

startAudio();


/* Reset game */

gameRunning =
true;

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


/* Reset player */

updatePlayerPosition();


player.style.bottom =
"110px";


/* Reset pursuer */

pursuer.style.transform =
"translateX(-50%) scale(0.72)";


/* Reset display */

updateScore();

updateEnergy();


distanceDisplay.textContent =
"0 m";


/* Remove old objects */

objects.innerHTML =
"";

collectibles.innerHTML =
"";


/* Hide start screen */

startScreen.classList.add(
"hidden"
);


/* Hide game over */

gameOverScreen.classList.add(
"hidden"
);


/* Start game timers */

obstacleTimer =
setInterval(
createObstacle,
1300
);


collectibleTimer =
setInterval(
createCollectible,
1700
);


distanceTimer =
setInterval(
updateDistance,
500
);


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


/* =========================================
END GAME
========================================= */

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


/* Final results */

finalScoreDisplay.textContent =
score;


finalDistanceDisplay.textContent =
distance +
" m";


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


bestScoreDisplay.textContent =
bestScore;


/* Show game over */

gameOverScreen.classList.remove(
"hidden"
);


playSound(
70,
0.7,
"sawtooth"
);

}


/* =========================================
KEYBOARD CONTROLS
========================================= */

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


/* =========================================
MOBILE BUTTONS
========================================= */

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


/* =========================================
SWIPE CONTROLS
========================================= */

let touchStartX =
0;

let touchStartY =
0;


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


else {


if (
deltaY <
-minimumSwipe
) {

jump();

}

}

},
{
passive: true
}
);


/* =========================================
START BUTTON
========================================= */

if (startButton) {

startButton.addEventListener(
"click",
startGame
);

}


/* =========================================
RESTART BUTTON
========================================= */

if (restartButton) {

restartButton.addEventListener(
"click",
startGame
);

}


/* =========================================
SOUND BUTTON
========================================= */

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


/* =========================================
INITIAL GAME STATE
========================================= */

updatePlayerPosition();

updateEnergy();

updateScore();


console.log(
"Shadow Run JavaScript loaded successfully."
);

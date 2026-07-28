/* =========================
ELEMENTS
========================= */

const game =
document.getElementById("game");

const player =
document.getElementById("player");

const objects =
document.getElementById("objects");

const scoreDisplay =
document.getElementById("score");

const coinCountDisplay =
document.getElementById("coinCount");

const startScreen =
document.getElementById("startScreen");

const startButton =
document.getElementById("startButton");

const gameOverScreen =
document.getElementById("gameOverScreen");

const restartButton =
document.getElementById("restartButton");

const finalScore =
document.getElementById("finalScore");

const finalCoins =
document.getElementById("finalCoins");

const bestScore =
document.getElementById("bestScore");

const topScore =
document.getElementById("score");

const soundButton =
document.getElementById("soundButton");

const leftButton =
document.getElementById("leftButton");

const rightButton =
document.getElementById("rightButton");

const jumpButton =
document.getElementById("jumpButton");


/* =========================
GAME VARIABLES
========================= */

let lane = 1;

let score = 0;

let coinCount = 0;

let speed = 5;

let gameRunning = false;

let gameOver = false;

let isJumping = false;

let lastTime = 0;

let spawnTimer = 0;

let coinTimer = 0;


/* =========================
LANES
========================= */

const lanePositions = [
"16.66%",
"50%",
"83.33%"
];


/* =========================
HIGH SCORE
========================= */

let highScore =
Number(
localStorage.getItem(
"railRushHighScore"
)
) || 0;


/* =========================
SOUND SYSTEM
Uses Web Audio API
========================= */

let audioContext = null;

let soundEnabled = true;


function initAudio() {

if (!audioContext) {

audioContext =
new (
window.AudioContext ||
window.webkitAudioContext
)();

}

}


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
0.15,
audioContext.currentTime
);


gain.gain.exponentialRampToValueAtTime(
0.001,
audioContext.currentTime +
duration
);


oscillator.connect(gain);

gain.connect(
audioContext.destination
);


oscillator.start();

oscillator.stop(
audioContext.currentTime +
duration
);

}


/* COIN SOUND */

function coinSound() {

playSound(
900,
.08,
"square"
);

setTimeout(
() => playSound(
1200,
.08,
"square"
),
80
);

}


/* JUMP SOUND */

function jumpSound() {

playSound(
500,
.2,
"sine"
);

}


/* GAME OVER SOUND */

function crashSound() {

playSound(
100,
.5,
"sawtooth"
);

}


/* =========================
SOUND BUTTON
========================= */

soundButton.addEventListener(
"click",
function() {

soundEnabled =
!soundEnabled;

soundButton.textContent =
soundEnabled
? "🔊"
: "🔇";

}
);


/* =========================
START GAME
========================= */

startButton.addEventListener(
"click",
function() {

initAudio();

startScreen.classList.add(
"hidden"
);

gameRunning = true;

gameOver = false;

lastTime =
performance.now();

requestAnimationFrame(
gameLoop
);

}
);


/* =========================
RESTART
========================= */

restartButton.addEventListener(
"click",
function() {

location.reload();

}
);


/* =========================
MOVE LEFT
========================= */

function moveLeft() {

if (
!gameRunning ||
gameOver
) {

return;

}


if (lane > 0) {

lane--;

player.style.left =
lanePositions[lane];

playSound(
250,
.08
);

}

}


/* =========================
MOVE RIGHT
========================= */

function moveRight() {

if (
!gameRunning ||
gameOver
) {

return;

}


if (lane < 2) {

lane++;

player.style.left =
lanePositions[lane];

playSound(
250,
.08
);

}

}


/* =========================
JUMP
========================= */

function jump() {

if (
!gameRunning ||
gameOver ||
isJumping
) {

return;

}


isJumping = true;

player.classList.add(
"jumping"
);

jumpSound();


setTimeout(
function() {

player.classList.remove(
"jumping"
);

isJumping = false;

},
550
);

}


/* =========================
KEYBOARD
========================= */

document.addEventListener(
"keydown",
function(event) {

if (
event.key ===
"ArrowLeft"
) {

moveLeft();

}

if (
event.key ===
"ArrowRight"
) {

moveRight();

}

if (
event.key ===
"ArrowUp" ||
event.key ===
" "
) {

event.preventDefault();

jump();

}

}
);


/* =========================
MOBILE BUTTONS
========================= */

leftButton.addEventListener(
"click",
moveLeft
);

rightButton.addEventListener(
"click",
moveRight
);

jumpButton.addEventListener(
"click",
jump
);


/* =========================
SWIPE CONTROLS
========================= */

let touchStartX = 0;

let touchStartY = 0;


game.addEventListener(
"touchstart",
function(event) {

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
function(event) {

const touch =
event.changedTouches[0];

const dx =
touch.clientX -
touchStartX;

const dy =
touch.clientY -
touchStartY;


if (
Math.abs(dx) >
Math.abs(dy)
) {

if (dx > 50) {

moveRight();

}

else if (dx < -50) {

moveLeft();

}

}

else {

if (dy < -50) {

jump();

}

}

},
{
passive: true
}
);


/* =========================
CREATE COIN
========================= */

function createCoin() {

const coin =
document.createElement(
"div"
);


coin.className =
"game-object coin";


coin.textContent =
"★";


const randomLane =
Math.floor(
Math.random() * 3
);


coin.style.left =
lanePositions[
randomLane
];


coin.style.top =
"-60px";


objects.appendChild(
coin
);


return coin;

}


/* =========================
CREATE BARRIER
========================= */

function createBarrier() {

const barrier =
document.createElement(
"div"
);


barrier.className =
"game-object barrier";


barrier.textContent =
"🚧";


const randomLane =
Math.floor(
Math.random() * 3
);


barrier.dataset.lane =
randomLane;


barrier.style.left =
lanePositions[
randomLane
];


barrier.style.top =
"-80px";


objects.appendChild(
barrier
);

}


/* =========================
CREATE TRAIN
========================= */

function createTrain() {

const train =
document.createElement(
"div"
);


train.className =
"game-object train";


const randomLane =
Math.floor(
Math.random() * 3
);


train.dataset.lane =
randomLane;


train.style.left =
lanePositions[
randomLane
];


train.style.top =
"-220px";


objects.appendChild(
train
);

}


/* =========================
COLLISION
========================= */

function isColliding(
playerRect,
objectRect
) {

return (

playerRect.left <
objectRect.right &&

playerRect.right >
objectRect.left &&

playerRect.top <
objectRect.bottom &&

playerRect.bottom >
objectRect.top

);

}


/* =========================
UPDATE OBJECTS
========================= */

function updateObjects(
deltaTime
) {

const allObjects =
document.querySelectorAll(
".game-object"
);


const playerRect =
player.getBoundingClientRect();


allObjects.forEach(
function(object) {

let currentTop =
parseFloat(
object.style.top
);


currentTop +=
speed *
deltaTime *
0.08;


object.style.top =
currentTop + "px";


const objectRect =
object.getBoundingClientRect();


/* COIN */

if (
object.classList.contains(
"coin"
)
) {

if (
isColliding(
playerRect,
objectRect
)
) {

coinCount++;

score += 10;

coinCountDisplay.textContent =
coinCount;

scoreDisplay.textContent =
score;

coinSound();

object.remove();

}

}


/* OBSTACLE */

else {

if (
isColliding(
playerRect,
objectRect
) &&
!isJumping
) {

endGame();

}

}


/* REMOVE OBJECT */

if (
currentTop >
window.innerHeight +
300
) {

object.remove();

}

}
);

}


/* =========================
GAME LOOP
========================= */

function gameLoop(
currentTime
) {

if (
!gameRunning ||
gameOver
) {

return;

}


const deltaTime =
currentTime -
lastTime;


lastTime =
currentTime;


spawnTimer +=
deltaTime;


coinTimer +=
deltaTime;


/* SPAWN OBSTACLES */

if (
spawnTimer >
Math.max(
650,
1300 -
score * 2
)
) {

spawnTimer = 0;


if (
Math.random() <
0.55
) {

createBarrier();

}

else {

createTrain();

}

}


/* SPAWN COINS */

if (
coinTimer >
500
) {

coinTimer = 0;

createCoin();

}


updateObjects(
deltaTime
);


/* SCORE */

score +=
deltaTime *
0.01;


scoreDisplay.textContent =
Math.floor(score);


/* SPEED */

speed =
5 +
Math.floor(
score / 100
);


requestAnimationFrame(
gameLoop
);

}


/* =========================
END GAME
========================= */

function endGame() {

if (gameOver) {

return;

}


gameOver = true;

gameRunning = false;


crashSound();


const final =
Math.floor(
score
);


if (
final >
highScore
) {

highScore =
final;


localStorage.setItem(
"railRushHighScore",
highScore
);

}


finalScore.textContent =
final;


finalCoins.textContent =
coinCount;


bestScore.textContent =
highScore;


gameOverScreen.classList.remove(
"hidden"
);

}

gameOverScreen.style.display =
"flex";

}

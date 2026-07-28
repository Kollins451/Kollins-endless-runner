/* =========================================
SHADOW RUN
Chase-Based Endless Runner
========================================= */


/* =========================================
GAME ELEMENTS
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

let speed = 6;

let gameTime = 0;

let animationFrame;

let obstacleTimer;

let collectibleTimer;

let distanceTimer;

let difficultyTimer;


/* =========================================
PLAYER LANES
========================================= */

const lanes = [25, 50, 75];

let currentLane = 1;


/* =========================================
PLAYER STATE
========================================= */

let isJumping = false;

let jumpHeight = 0;

let jumpVelocity = 0;


/* =========================================
PURSUER
========================================= */

let pursuerDistance = 0;


/* =========================================
SOUND
========================================= */

let soundEnabled = true;

let audioContext;


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
AUDIO SYSTEM
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


/* Simple sound effect */

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


/* =========================================
PLAYER MOVEMENT
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


/* Update player position */

function updatePlayerPosition() {

player.style.left =
lanes[currentLane] + "%";

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

isJumping = true;

jumpVelocity = 16;

playSound(
520,
0.12
);

}


/* =========================================
JUMP PHYSICS
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

jumpHeight = 0;

jumpVelocity = 0;

isJumping = false;

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

obstacle.classList.add(
"game-object"
);

const vehicle =
Math.random() > 0.5;

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

collectible.classList.add(
"collectible"
);

collectible.classList.add(
"game-object"
);

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
MOVE OBJECTS
========================================= */

function updateObjects() {

const allObjects =
document.querySelectorAll(
".game-object"
);

allObjects.forEach(
object => {

let currentTop =
parseFloat(
object.style.top
);

currentTop +=
speed;

object.style.top =
currentTop + "px";


/* Collision */

checkCollision(
object,
currentTop
);


/* Remove objects */

if (
currentTop >
window.innerHeight
) {

object.remove();

}

}
);

}


/* =========================================
COLLISION DETECTION
========================================= */

function checkCollision(
object,
objectTop
) {

const objectLane =
Number(
object.dataset.lane
);

const playerLane =
currentLane;


/* Only check same lane */

if (
objectLane !==
playerLane
) {

return;

}


/* Player vertical position */

const playerBottom =
110 +
jumpHeight;


/* Obstacle collision */

if (
object.classList.contains(
"obstacle"
) ||
object.classList.contains(
"vehicle"
)
) {

if (
objectTop >
window.innerHeight -
playerBottom -
170 &&

objectTop <
window.innerHeight -
playerBottom -
50 &&

!isJumping
) {

hitObstacle(
object
);

}

}


/* Collectible */

if (
object.classList.contains(
"collectible"
)
) {

if (
objectTop >
window.innerHeight -
350 &&

objectTop <
window.innerHeight -
80
) {

collectEnergy(
object
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

obstacle.remove();

energy -=
20;

pursuerDistance +=
15;

updateEnergy();

pursuer.style.transform =
"translateX(-50%) scale(0.95)";

setTimeout(
() => {

pursuer.style.transform =
"translateX(-50%) scale(0.72)";

},
500
);

playSound(
90,
0.4,
"sawtooth"
);


/* Game over */

if (
energy <= 0
) {

energy = 0;

endGame();

}

}


/* =========================================
COLLECT ENERGY
========================================= */

function collectEnergy(
collectible
) {

collectible.remove();

score +=
50;

energy +=
10;

if (
energy >
100
) {

energy = 100;

}

updateEnergy();

updateScore();

playSound(
750,
0.15,
"sine"
);

}


/* =========================================
ENERGY BAR
========================================= */

function updateEnergy() {

energyFill.style.width =
energy + "%";

}


/* =========================================
SCORE
========================================= */

function updateScore() {

scoreDisplay.textContent =
score;

}


/* =========================================
DISTANCE
========================================= */

function updateDistance() {

distance +=
1;

distanceDisplay.textContent =
distance +
" m";


/* Score increases with distance */

score +=
1;

updateScore();

}


/* =========================================
DIFFICULTY
========================================= */

function increaseDifficulty() {

if (!gameRunning) {
return;
}

speed +=
0.5;

if (
speed >
15
) {

speed = 15;

}

}


/* =========================================
PURSUER SYSTEM
========================================= */

function updatePursuer() {

if (!gameRunning) {
return;
}


/* The pursuer slowly approaches */

if (
pursuerDistance <
100
) {

pursuerDistance +=
0.03;

}


/* Visual scale */

const scale =
0.72 +
(
pursuerDistance /
100
) *
0.35;


pursuer.style.transform =
`translateX(-50%) scale(${scale})`;


/* If pursuer gets too close */

if (
pursuerDistance >=
100
) {

endGame();

}

}


/* =========================================
MAIN GAME LOOP
========================================= */

function gameLoop() {

if (!gameRunning) {
return;
}

updateJump();

updateObjects();

updatePursuer();

animationFrame =
requestAnimationFrame(
gameLoop
);

}


/* =========================================
START GAME
========================================= */

function startGame() {

startAudio();

gameRunning =
true;

score =
0;

distance =
0;

energy =
100;

speed =
6;

pursuerDistance =
0;

currentLane =
1;

isJumping =
false;

jumpHeight =
0;

updatePlayerPosition();

updateScore();

updateEnergy();


distanceDisplay.textContent =
"0 m";


player.style.bottom =
"110px";


pursuer.style.transform =
"translateX(-50%) scale(0.72)";


/* Clear old objects */

objects.innerHTML =
"";

collectibles.innerHTML =
"";


/* Hide start screen */

startScreen.classList.add(
"hidden"
);

gameOverScreen.classList.add(
"hidden"
);


/* Start timers */

obstacleTimer =
setInterval(
createObstacle,
1200
);


collectibleTimer =
setInterval(
createCollectible,
1800
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


/* Update final results */

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

moveLeftButton.addEventListener(
"pointerdown",
moveLeft
);


moveRightButton.addEventListener(
"pointerdown",
moveRight
);


jumpButton.addEventListener(
"pointerdown",
jump
);


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

const touch =
event.changedTouches[0];

const endX =
touch.clientX;

const endY =
touch.clientY;


const deltaX =
endX -
touchStartX;

const deltaY =
endY -
touchStartY;


const minimumSwipe =
40;


/* Horizontal swipe */

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


/* Up swipe */

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
BUTTON EVENTS
========================================= */

startButton.addEventListener(
"click",
startGame
);


restartButton.addEventListener(
"click",
startGame
);


/* =========================================
SOUND BUTTON
========================================= */

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


/* =========================================
INITIAL STATE
========================================= */

updatePlayerPosition();

updateEnergy();

updateScore();

bestScoreDisplay.textContent =
bestScore;

gameOverScreen.style.display =
"flex";

}

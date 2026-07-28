/* =====================================================
RAIL ESCAPE
ENDLESS RUNNER
===================================================== */


/* =========================================
ELEMENTS
========================================= */

const game =
document.getElementById(
"game"
);

const player =
document.getElementById(
"player"
);

const chaser =
document.getElementById(
"chaser"
);

const skateboard =
document.getElementById(
"skateboard"
);

const trains =
document.getElementById(
"trains"
);

const barriers =
document.getElementById(
"barriers"
);

const coinsContainer =
document.getElementById(
"coins"
);

const loadingScreen =
document.getElementById(
"loadingScreen"
);

const startScreen =
document.getElementById(
"startScreen"
);

const gameOverScreen =
document.getElementById(
"gameOverScreen"
);

const loadingProgress =
document.getElementById(
"loadingProgress"
);

const scoreDisplay =
document.getElementById(
"score"
);

const coinScoreDisplay =
document.getElementById(
"coinScore"
);

const distanceDisplay =
document.getElementById(
"distance"
);

const finalScoreDisplay =
document.getElementById(
"finalScore"
);

const powerUp =
document.getElementById(
"powerUp"
);


/* =========================================
GAME STATE
========================================= */

let running =
false;

let score =
0;

let coinScore =
0;

let distance =
0;

let speed =
6;

let lane =
1;

let jump =
false;

let skateboardActive =
false;

let gameAnimation;

let spawnTimer;

let coinTimer;

let trainTimer;

let difficultyTimer;

let lastTap =
0;

let playerX = 50;

let chaserDistance =
14;


/* =========================================
LANES
========================================= */

const lanePositions = [

30,

50,

70

];


/* =========================================
LOADING
========================================= */

let loading =
0;


const loadingTimer =
setInterval(
() => {

loading +=
Math.random() *
12;


if (
loading >=
100
) {

loading =
100;


clearInterval(
loadingTimer
);


loadingProgress
.style
.width =
"100%";


setTimeout(
() => {

loadingScreen
.classList
.add(
"hidden"
);


startScreen
.classList
.remove(
"hidden"
);

},
500
);

}


loadingProgress
.style
.width =
loading +
"%";

},
150
);


/* =========================================
START GAME
========================================= */

function startGame() {

if (
running
) {

return;

}


running =
true;


score =
0;

coinScore =
0;

distance =
0;

speed =
6;

lane =
1;

playerX =
50;

chaserDistance =
14;


player
.style
.left =
"50%";


chaser
.style
.left =
"50%";


startScreen
.classList
.add(
"hidden"
);


gameOverScreen
.classList
.add(
"hidden"
);


clearWorld();


updateScore();


spawnTimer =
setInterval(
spawnBarrier,
1300
);


coinTimer =
setInterval(
spawnCoin,
850
);


trainTimer =
setInterval(
spawnTrain,
4000
);


difficultyTimer =
setInterval(
() => {

speed +=
.5;

},
8000
);


gameAnimation =
requestAnimationFrame(
gameLoop
);

}


/* =========================================
GAME LOOP
========================================= */

function gameLoop() {

if (
!running
) {

return;

}


distance +=
speed *
.015;


score +=
Math.floor(
speed *
.02
);


/* Chaser movement */

chaserDistance -=
0.002;


chaser.style.bottom =
(
11 +
(
14 -
chaserDistance
) *
.2
) +
"%";


if (
chaserDistance <=
2
) {

endGame();

return;

}


updateScore();


gameAnimation =
requestAnimationFrame(
gameLoop
);

}


/* =========================================
SCORE
========================================= */

function updateScore() {

scoreDisplay
.textContent =
Math.floor(
score
);


coinScoreDisplay
.textContent =
coinScore;


distanceDisplay
.textContent =
Math.floor(
distance
) +
"m";

}


/* =========================================
MOVE LEFT
========================================= */

function moveLeft() {

if (
!running
) {

return;

}


if (
lane >
0
) {

lane--;

playerX =
lanePositions[
lane
];


player
.style
.left =
playerX +
"%";


chaser
.style
.left =
playerX +
"%";

}

}


/* =========================================
MOVE RIGHT
========================================= */

function moveRight() {

if (
!running
) {

return;

}


if (
lane <
2
) {

lane++;

playerX =
lanePositions[
lane
];


player
.style
.left =
playerX +
"%";


chaser
.style
.left =
playerX +
"%";

}

}


/* =========================================
JUMP
========================================= */

function jumpPlayer() {

if (
!running ||
jump
) {

return;

}


jump =
true;


player
.style
.bottom =
"32%";


setTimeout(
() => {

player
.style
.bottom =
"19%";


jump =
false;

},
650
);

}


/* =========================================
SPAWN BARRIER
========================================= */

function spawnBarrier() {

if (
!running
) {

return;

}


const obstacle =
document.createElement(
"div"
);


obstacle.className =
"barrier";


const selectedLane =
Math.floor(
Math.random() *
3
);


obstacle.dataset.lane =
selectedLane;


obstacle.style.left =
lanePositions[
selectedLane
] +
"%";


obstacle.style.top =
"-100px";


barriers.appendChild(
obstacle
);


moveObject(
obstacle,
"barrier"
);

}


/* =========================================
SPAWN COIN
========================================= */

function spawnCoin() {

if (
!running
) {

return;

}


const coin =
document.createElement(
"div"
);


coin.className =
"coin";


const selectedLane =
Math.floor(
Math.random() *
3
);


coin.dataset.lane =
selectedLane;


coin.style.left =
lanePositions[
selectedLane
] +
"%";


coin.style.top =
"-50px";


coinsContainer.appendChild(
coin
);


moveObject(
coin,
"coin"
);

}


/* =========================================
SPAWN TRAIN
========================================= */

function spawnTrain() {

if (
!running
) {

return;

}


const train =
document.createElement(
"div"
);


train.className =
"train";


const selectedLane =
Math.floor(
Math.random() *
3
);


train.dataset.lane =
selectedLane;


train.style.left =
lanePositions[
selectedLane
] +
"%";


train.style.top =
"-350px";


trains.appendChild(
train
);


moveObject(
train,
"train"
);

}


/* =========================================
MOVE OBJECT
========================================= */

function moveObject(
object,
type
) {

let top =
parseFloat(
object.style.top
);


const timer =
setInterval(
() => {

if (
!running
) {

clearInterval(
timer
);

return;

}


top +=
speed;


object.style.top =
top +
"px";


checkCollision(
object,
type
);


if (
top >
window.innerHeight +
400
) {

object.remove();


clearInterval(
timer
);

}

},
30
);

}


/* =========================================
COLLISION
========================================= */

function checkCollision(
object,
type
) {

const objectLane =
Number(
object.dataset.lane
);


if (
objectLane !==
lane
) {

return;

}


const playerRect =
player.getBoundingClientRect();


const objectRect =
object.getBoundingClientRect();


const collision =
playerRect.left <
objectRect.right &&

playerRect.right >
objectRect.left &&

playerRect.top <
objectRect.bottom &&

playerRect.bottom >
objectRect.top;


if (
collision
) {

if (
type ===
"coin"
) {

collectCoin(
object
);

}


else {

hitObstacle(
object
);

}

}

}


/* =========================================
COLLECT COIN
========================================= */

function collectCoin(
coin
) {

if (
!coin ||
!coin.parentNode
) {

return;

}


coin.remove();


coinScore++;

score +=
100;


/* Chance to get skateboard */

if (
Math.random() >
.85
) {

skateboardActive =
true;


powerUp
.innerHTML =
"🛹<span>DOUBLE TAP TO USE</span>";

}

}


/* =========================================
HIT OBSTACLE
========================================= */

function hitObstacle(
object
) {

if (
!object ||
!object.parentNode
) {

return;

}


object.remove();


/* Skateboard saves player */

if (
skateboardActive
) {

skateboardActive =
false;


player
.classList
.add(
"skating"
);


powerUp
.innerHTML =
"🛹 SKATEBOARD USED";


chaserDistance +=
5;


setTimeout(
() => {

player
.classList
.remove(
"skating"
);

},
1000
);


return;

}


/* Crash without skateboard */

chaserDistance -=
3;


if (
chaserDistance <=
2
) {

endGame();

}

}


/* =========================================
DOUBLE TAP SKATEBOARD
========================================= */

game.addEventListener(
"touchend",
handleDoubleTap
);


game.addEventListener(
"click",
handleDoubleTap
);


function handleDoubleTap() {

if (
!running
) {

startGame();

return;

}


const now =
Date.now();


if (
now -
lastTap <
350
) {

activateSkateboard();

}


lastTap =
now;

}


/* =========================================
ACTIVATE SKATEBOARD
========================================= */

function activateSkateboard() {

if (
!skateboardActive
) {

return;

}


skateboardActive =
false;


player
.classList
.add(
"skating"
);


powerUp
.innerHTML =
"🛹 SKATEBOARD ACTIVE";


/* Skateboard gives temporary protection */

setTimeout(
() => {

player
.classList
.remove(
"skating"
);


powerUp
.innerHTML =
"🛹 POWER-UP EMPTY";

},
5000
);

}


/* =========================================
KEYBOARD
========================================= */

document.addEventListener(
"keydown",
event => {

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

jumpPlayer();

}

}
);


/* =========================================
SWIPE CONTROLS
========================================= */

let startX =
0;

let startY =
0;


game.addEventListener(
"touchstart",
event => {

startX =
event.changedTouches[0]
.screenX;

startY =
event.changedTouches[0]
.screenY;

},
{
passive: true
}
);


game.addEventListener(
"touchend",
event => {

const endX =
event.changedTouches[0]
.screenX;

const endY =
event.changedTouches[0]
.screenY;


const deltaX =
endX -
startX;


const deltaY =
endY -
startY;


if (
Math.abs(deltaX) >
Math.abs(deltaY)
) {

if (
deltaX >
50
) {

moveRight();

}


if (
deltaX <
-50
) {

moveLeft();

}

}

else {

if (
deltaY <
-50
) {

jumpPlayer();

}

}

},
{
passive: true
}
);


/* =========================================
GAME OVER
========================================= */

function endGame() {

if (
!running
) {

return;

}


running =
false;


cancelAnimationFrame(
gameAnimation
);


clearInterval(
spawnTimer
);

clearInterval(
coinTimer
);

clearInterval(
trainTimer
);

clearInterval(
difficultyTimer
);


finalScoreDisplay
.textContent =
Math.floor(
score
);


gameOverScreen
.classList
.remove(
"hidden"
);

}


/* =========================================
RESTART
========================================= */

gameOverScreen.addEventListener(
"click",
() => {

clearWorld();


gameOverScreen
.classList
.add(
"hidden"
);


startGame();

}
);


/* =========================================
CLEAR WORLD
========================================= */

function clearWorld() {

trains.innerHTML =
"";

barriers.innerHTML =
"";

coinsContainer.innerHTML =
"";

}


/* =========================================
START SCREEN
========================================= */

startScreen.addEventListener(
"click",
() => {

startGame();

}
);

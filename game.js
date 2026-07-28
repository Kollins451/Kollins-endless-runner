/*
==================================================
RAIL RUSH
PHASER ENDLESS RUNNER
==================================================
*/


/* ================================================
GAME VARIABLES
================================================ */

let game;

let player;

let chaser;

let lanes = [];

let currentLane = 1;

let isJumping = false;

let jumpTimer = 0;

let gameStarted = false;

let gameOver = false;

let score = 0;

let distance = 0;

let coins = 0;

let speed = 280;

let skateboardActive = false;

let skateboardUsed = false;

let lastSpawn = 0;

let lastCoinSpawn = 0;

let lastTrainSpawn = 0;

let lastDifficultyIncrease = 0;

let swipeStartX = 0;

let swipeStartY = 0;

let soundsEnabled = true;


/* ================================================
CONFIGURATION
================================================ */

const config = {

type:
Phaser.AUTO,

parent:
"game-container",

width:
720,

height:
1280,

backgroundColor:
"#111827",

scale: {

mode:
Phaser.Scale.RESIZE,

autoCenter:
Phaser.Scale.CENTER_BOTH

},

physics: {

default:
"arcade",

arcade: {

debug:
false

}

},

scene: {

preload:
preload,

create:
create,

update:
update

}

};


game =
new Phaser.Game(
config
);


/* ================================================
PRELOAD
================================================ */

function preload() {

/*
We are using generated shapes and text
instead of copyrighted game assets.
*/

}


/* ================================================
CREATE
================================================ */

function create() {

this.scene
.backgroundColor =
"#101827";


/* ---------------------------------------------
RAILWAY BACKGROUND
--------------------------------------------- */

createRailway(
this
);


/* ---------------------------------------------
LANES
--------------------------------------------- */

lanes = [

this.scale.width * 0.30,

this.scale.width * 0.50,

this.scale.width * 0.70

];


/* ---------------------------------------------
PLAYER
--------------------------------------------- */

player =
this.add
.rectangle(

lanes[1],

this.scale.height - 250,

55,

90,

0x22c55e

)
.setDepth(20);


player.setStrokeStyle(
4,
0xffffff
);


/* Player face */

this.add
.circle(

player.x,

player.y - 30,

18,

0xffcc99

)
.setDepth(21);


/* ---------------------------------------------
CHASER
--------------------------------------------- */

chaser =
this.add
.rectangle(

lanes[1],

this.scale.height - 100,

70,

100,

0xef4444

)
.setDepth(15);


chaser.setStrokeStyle(
4,
0xffffff
);


/* ---------------------------------------------
UI
--------------------------------------------- */

createUI(
this
);


/* ---------------------------------------------
TAP TO START
--------------------------------------------- */

createStartScreen(
this
);


/* ---------------------------------------------
INPUT
--------------------------------------------- */

setupControls(
this
);


/* ---------------------------------------------
RESIZE
--------------------------------------------- */

this.scale.on(
"resize",
resizeGame,
this
);

}


/* ================================================
RAILWAY
================================================ */

function createRailway(
scene
) {

const width =
scene.scale.width;

const height =
scene.scale.height;


/* Sky */

scene.add
.rectangle(

width / 2,

height / 2,

width,

height,

0x7dd3fc

);


/* Distant city */

for (
let i = 0;
i < 12;
i++
) {

const buildingHeight =
Phaser.Math.Between(
120,
320
);


scene.add
.rectangle(

i *
(
width / 10
),

height -
500 -
buildingHeight / 2,

100,

buildingHeight,

Phaser.Math.RND.pick([

0x334155,

0x475569,

0x1e293b,

0x64748b

])

);

}


/* Railway ground */

scene.add
.rectangle(

width / 2,

height - 300,

width,

700,

0x374151

);


/* Track lanes */

for (
let lane = 0;
lane < 3;
lane++
) {

const x =
width *
(
0.30 +
lane *
0.20
);


/* Rails */

scene.add
.rectangle(

x - 35,

height / 2,

8,

height,

0x94a3b8

);


scene.add
.rectangle(

x + 35,

height / 2,

8,

height,

0x94a3b8

);


/* Sleepers */

for (
let y = 300;
y < height;
y += 100
) {

scene.add
.rectangle(

x,

y,

100,

14,

0x78350f

);

}

}


/* Side fences */

scene.add
.rectangle(

width * 0.08,

height / 2,

12,

height,

0x64748b

);


scene.add
.rectangle(

width * 0.92,

height / 2,

12,

height,

0x64748b

);

}


/* ================================================
UI
================================================ */

function createUI(
scene
) {

scene.scoreText =
scene.add
.text(

25,

25,

"SCORE 0",

{

fontSize:
"32px",

color:
"#ffffff",

fontStyle:
"bold"

}

)
.setDepth(100);


scene.distanceText =
scene.add
.text(

25,

65,

"DISTANCE 0m",

{

fontSize:
"22px",

color:
"#e5e7eb"

}

)
.setDepth(100);


scene.coinText =
scene.add
.text(

25,

100,

"🪙 0",

{

fontSize:
"24px",

color:
"#fde047"

}

)
.setDepth(100);


scene.powerText =
scene.add
.text(

25,

140,

"SKATEBOARD: OFF",

{

fontSize:
"18px",

color:
"#ffffff"

}

)
.setDepth(100);

}


/* ================================================
START SCREEN
================================================ */

function createStartScreen(
scene
) {

scene.startOverlay =
scene.add
.rectangle(

scene.scale.width / 2,

scene.scale.height / 2,

scene.scale.width,

scene.scale.height,

0x000000,

0.65

)
.setDepth(200);


scene.startTitle =
scene.add
.text(

scene.scale.width / 2,

scene.scale.height * 0.35,

"RAIL RUSH",

{

fontSize:
"70px",

fontStyle:
"bold",

color:
"#ffffff",

stroke:
"#000000",

strokeThickness:
10

}

)
.setOrigin(
0.5
)
.setDepth(201);


scene.startText =
scene.add
.text(

scene.scale.width / 2,

scene.scale.height * 0.55,

"TAP ANYWHERE TO RUN",

{

fontSize:
"32px",

color:
"#facc15",

fontStyle:
"bold"

}

)
.setOrigin(
0.5
)
.setDepth(201);


scene.input.once(
"pointerdown",
() => {

startGame(
scene
);

}
);

}


/* ================================================
START GAME
================================================ */

function startGame(
scene
) {

if (gameStarted) {

return;

}


gameStarted =
true;


gameOver =
false;


score =
0;


distance =
0;


coins =
0;


speed =
280;


skateboardActive =
false;


skateboardUsed =
false;


currentLane =
1;


player.x =
lanes[1];


chaser.x =
lanes[1];


scene.startOverlay
.setVisible(
false
);


scene.startTitle
.setVisible(
false
);


scene.startText
.setVisible(
false
);


updateUI(
scene
);

}


/* ================================================
UPDATE
================================================ */

function update(
time,
delta
) {

if (
!gameStarted ||
gameOver
) {

return;

}


/* ---------------------------------------------
DISTANCE
--------------------------------------------- */

distance +=
speed *
delta /
100000;


score +=
Math.floor(
speed *
delta /
10000
);


/* ---------------------------------------------
SPEED
--------------------------------------------- */

if (
time -
lastDifficultyIncrease >
10000
) {

speed +=
20;


lastDifficultyIncrease =
time;

}


/* ---------------------------------------------
SPAWN OBSTACLES
--------------------------------------------- */

if (
time -
lastSpawn >
1200
) {

spawnBarrier(
this
);


lastSpawn =
time;

}


/* ---------------------------------------------
SPAWN COINS
--------------------------------------------- */

if (
time -
lastCoinSpawn >
800
) {

spawnCoin(
this
);


lastCoinSpawn =
time;

}


/* ---------------------------------------------
SPAWN TRAINS
--------------------------------------------- */

if (
time -
lastTrainSpawn >
5000
) {

spawnTrain(
this
);


lastTrainSpawn =
time;

}


/* ---------------------------------------------
PLAYER JUMP
--------------------------------------------- */

if (isJumping) {

jumpTimer -=
delta;


player.y -=
1.5;


if (
jumpTimer <=
0
) {

isJumping =
false;


player.y =
this.scale.height -
250;

}

}


/* ---------------------------------------------
CHASER
--------------------------------------------- */

if (
chaser.x <
player.x
) {

chaser.x +=
0.5;

}


if (
chaser.x >
player.x
) {

chaser.x -=
0.5;

}


/* ---------------------------------------------
UPDATE UI
--------------------------------------------- */

updateUI(
this
);

}


/* ================================================
SPAWN BARRIER
================================================ */

function spawnBarrier(
scene
) {

const lane =
Phaser.Math.Between(
0,
2
);


const barrier =
scene.add
.rectangle(

lanes[lane],

-100,

90,

70,

0xf97316

)
.setDepth(10);


scene.tweens.add({

targets:
barrier,

y:
scene.scale.height +
200,

duration:
5000,

onUpdate:
() => {

if (
checkCollision(
player,
barrier
)
) {

handleCrash(
barrier,
scene
);

}

},

onComplete:
() => {

barrier.destroy();

}

});

}


/* ================================================
SPAWN COIN
================================================ */

function spawnCoin(
scene
) {

const lane =
Phaser.Math.Between(
0,
2
);


const coin =
scene.add
.circle(

lanes[lane],

-50,

20,

0xfacc15

)
.setDepth(12);


scene.tweens.add({

targets:
coin,

y:
scene.scale.height +
100,

duration:
4500,

onUpdate:
() => {

if (
checkCollision(
player,
coin
)
) {

collectCoin(
coin,
scene
);

}

},

onComplete:
() => {

coin.destroy();

}

});

}


/* ================================================
SPAWN TRAIN
================================================ */

function spawnTrain(
scene
) {

const lane =
Phaser.Math.Between(
0,
2
);


const train =
scene.add
.rectangle(

lanes[lane],

-400,

140,

450,

0x2563eb

)
.setDepth(8);


train.setStrokeStyle(
8,
0xeab308
);


scene.tweens.add({

targets:
train,

y:
scene.scale.height +
500,

duration:
6500,

onUpdate:
() => {

if (
checkCollision(
player,
train
)
) {

handleCrash(
train,
scene
);

}

},

onComplete:
() => {

train.destroy();

}

});

}


/* ================================================
COLLISION
================================================ */

function checkCollision(
a,
b
) {

if (
!a ||
!b
) {

return false;

}


return Phaser.Geom.Intersects.RectangleToRectangle(

a.getBounds(),

b.getBounds()

);

}


/* ================================================
CRASH
================================================ */

function handleCrash(
obstacle,
scene
) {

if (
!obstacle ||
!obstacle.active
) {

return;

}


obstacle.destroy();


/* Skateboard saves player */

if (
skateboardActive
) {

skateboardActive =
false;


skateboardUsed =
true;


scene.powerText
.setText(
"SKATEBOARD USED!"
);


return;

}


/* No skateboard */

chaser.y -=
50;


speed -=
40;


if (
speed <
180
) {

speed =
180;

}


/* Chaser catches player */

if (
skateboardUsed
) {

endGame(
scene
);

}

}


/* ================================================
COLLECT COIN
================================================ */

function collectCoin(
coin,
scene
) {

if (
!coin.active
) {

return;

}


coin.destroy();


coins++;


score +=
100;


/* Random chance to get skateboard */

if (
Math.random() >
0.90
) {

skateboardActive =
true;


skateboardUsed =
false;


scene.powerText
.setText(
"🛹 SKATEBOARD ACTIVE"
);

}

}


/* ================================================
END GAME
================================================ */

function endGame(
scene
) {

gameOver =
true;


scene.add
.rectangle(

scene.scale.width / 2,

scene.scale.height / 2,

scene.scale.width,

scene.scale.height,

0x000000,

0.75

)
.setDepth(300);


scene.add
.text(

scene.scale.width / 2,

scene.scale.height * 0.40,

"CAUGHT!",

{

fontSize:
"80px",

color:
"#ef4444",

fontStyle:
"bold"

}

)
.setOrigin(
0.5
)
.setDepth(301);


scene.add
.text(

scene.scale.width / 2,

scene.scale.height * 0.50,

"The chaser caught you.",

{

fontSize:
"30px",

color:
"#ffffff"

}

)
.setOrigin(
0.5
)
.setDepth(301);


scene.add
.text(

scene.scale.width / 2,

scene.scale.height * 0.60,

"TAP TO RUN AGAIN",

{

fontSize:
"28px",

color:
"#facc15",

fontStyle:
"bold"

}

)
.setOrigin(
0.5
)
.setDepth(301);


scene.input.once(
"pointerdown",
() => {

scene.scene.restart();

}
);

}


/* ================================================
CONTROLS
================================================ */

function setupControls(
scene
) {


/* Keyboard */

scene.input.keyboard.on(
"keydown-LEFT",
() => {

moveLeft();

}
);


scene.input.keyboard.on(
"keydown-RIGHT",
() => {

moveRight();

}
);


scene.input.keyboard.on(
"keydown-UP",
() => {

jump();

}
);


/* Touch */

scene.input.on(
"pointerdown",
pointer => {

swipeStartX =
pointer.x;

swipeStartY =
pointer.y;

}
);


scene.input.on(
"pointerup",
pointer => {

if (
!gameStarted
) {

return;

}


const deltaX =
pointer.x -
swipeStartX;


const deltaY =
pointer.y -
swipeStartY;


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


else if (
deltaX <
-50
) {

moveLeft();

}

}


else if (
deltaY <
-50
) {

jump();

}

}
);

}


/* ================================================
MOVE LEFT
================================================ */

function moveLeft() {

if (
currentLane >
0
) {

currentLane--;

player.x =
lanes[currentLane];

}

}


/* ================================================
MOVE RIGHT
================================================ */

function moveRight() {

if (
currentLane <
2
) {

currentLane++;

player.x =
lanes[currentLane];

}

}


/* ================================================
JUMP
================================================ */

function jump() {

if (
isJumping ||
!gameStarted
) {

return;

}


isJumping =
true;


jumpTimer =
700;

}


/* ================================================
UPDATE UI
================================================ */

function updateUI(
scene
) {

if (
scene.scoreText
) {

scene.scoreText
.setText(
"SCORE " +
score
);

}


if (
scene.distanceText
) {

scene.distanceText
.setText(

"DISTANCE " +
Math.floor(
distance
) +
"m"

);

}


if (
scene.coinText
) {

scene.coinText
.setText(

"🪙 " +
coins

);

}

}


/* ================================================
RESIZE
================================================ */

function resizeGame(
size
) {

if (!player) {

return;

}


lanes = [

size.width * 0.30,

size.width * 0.50,

size.width * 0.70

];


player.x =
lanes[currentLane];


chaser.x =
lanes[currentLane];

}



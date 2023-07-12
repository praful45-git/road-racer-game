import { moveSelectCarLeft, moveSelectCarRight } from "./selectCar.js";

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

//audio
const homeMusic = document.getElementById("homeSound")
const racingCarSound = document.getElementById("racingCarSound")
const bulletSound = document.getElementById("bulletSound")
const lifeSound = document.getElementById("lifeSound")
const bulletCollectSound = document.getElementById("bulletCollectSound")
const carCrashSound = document.getElementById("carCrashSound")

//select cars
//drawing car
const greenCarImg = new Image();
greenCarImg.src = "./assets/bright-green-racing-car.png";

const redCarImg = new Image();
redCarImg.src = "./assets/red-racing-car.png";

const blueCarImg = new Image();
blueCarImg.src = "./assets/blue-racing-car.png";

const yellowCarImg = new Image();
yellowCarImg.src = "./assets/yellow-racing-car.png";
let isCarImageLoaded = false;

greenCarImg.onload = function () {
    isCarImageLoaded = true;
};

const enemy = [
    { width: 25, height: 35, health: 1, level: 1, type: "enemy", damage: 1, point: 2 },
    { width: 35, height: 55, health: 2, level: 2, type: "enemy", damage: 1, point: 2 },
    { width: 50, height: 100, health: 3, level: 3, type: "enemy", damage: 2, point: 3 },
    { width: 35, height: 35, health: 1, level: 4, type: "boost", damage: 0, point: 0 }, // life item - imposter as enemy hahaha 
    { width: 35, height: 35, health: 0, level: 5, type: "ammo", damage: 0, point: 0 },
]

const streetEle = [
    { width: 31, height: 50, type: "tree" },
    { width: 31, height: 35, type: "bush" },
    { width: 31, height: 50, type: "house" },

]

const street = {
    x1: 0,
    x2: 350,
    y: 0,
    width: 50,
    height: 600

}

const selectCars = [
    {carImg: greenCarImg},
    {carImg: blueCarImg},
    {carImg: yellowCarImg},
    {carImg: redCarImg},
]

const car = {
    initX: canvas.width / 2 - 20,
    initY: 510,
    x: canvas.width / 2 - 20,
    y: 510,
    width: 37,
    height: 75,
    healthStat: 9,
    ammo: 100
}

const battery = {
    outlineX: 65 + 210,
    outlineY: 25,
    outlineWidth: 60,
    outlineHeight: 20,
    x1: 68 + 210,
    x2: 87 + 210,
    x3: 106 + 210,
    y: 28,
    width: 16,
    height: 14
}

let blocks = [];
let bullets = [];
let lanes = [];
let trees = [];
let score = 0;
let gameStarted = false;
let gameOver = false;
let carFlexibility = 21;
let speed = 7;
let envSpeed = 6;

const speedIncreasePercentage = 15;

let initbullet = {
    width: 5,
    height: 15,
    color: "red",
    speed: 5,
    active: false
}

let canFireBullet = true;
let canCollide = true;
let canIncreaseSpeed = true;
let isBlink = true;
let showStart = true;
let recentCollide = false;
let canPlayHomeMusic = true;
let pauseMusic = false;

//highscsore
if (localStorage.getItem("highScore") === null) {
    localStorage.setItem("highScore", 0);
}
let currhighScore = localStorage.getItem("highScore");

const heartImg = new Image();
heartImg.src = "./assets/heart.png";



//left right key eventlistener
document.addEventListener("keydown", (e) => {
    if (e.code == "Enter") {
        if (!gameOver) {
            showStart = false;
            gameStarted = true;
            canPlayHomeMusic = false;
            gameLoop();
        }
        else {
            showStart = true;
            gameOver = false;
            blocks = [];
            bullets = [];
            score = 0;
            car.healthStat = 9;
            car.ammo = 100;
            speed = 7;
            envSpeed = 6;
            recentCollide = false;
            canPlayHomeMusic = true;
        }

    }
    if (gameStarted) {
        if (e.code == "ArrowLeft") {
            moveCarLeft();
        }
        if (e.code == "ArrowRight") {
            moveCarRight();
        }
        if (e.code == "ArrowUp") {
            moveCarUp();
        }
        if (e.code == "ArrowDown") {
            moveCarDown();
        }
        if (e.code == "Space" && canFireBullet) {
            setBullet();
        }
    }else{
        let totalCars = selectCars.length;
        if (e.code == "ArrowLeft") {
            moveSelectCarLeft(selectCars,1,totalCars);
        }
        if (e.code == "ArrowRight") {
            moveSelectCarRight(selectCars,1,totalCars);
        }
        if(e.code == "KeyM"){
            console.log("m")
            pauseMusic = !pauseMusic;
            homeMusic.pause();
            homeMusic.currentTime = 0;
        }
    }
})

//select Cars
function selectCar(){
    context.drawImage(selectCars[0].carImg, car.initX-100,car.initY+50, car.width,car.height);
    context.drawImage(selectCars[1].carImg, car.initX,car.initY, car.width,car.height);
    context.drawImage(selectCars[2].carImg, car.initX+100,car.initY+50, car.width,car.height);
}

//Game Animation
function gameAnimation() {
    if (!gameOver) {
        clearCanvas();
        moveLanes();
        drawLanes();
        moveTrees();
        drawTrees();
        playMusic();
        if (showStart) {
            startPrompt();
            selectCar();
        }
        drawCar();
        gameLoop();
    }
}
setInterval(gameAnimation, 1000 / 60)

function gameLoop() {
    if (gameStarted) {
        setGlow();
        drawBlocks();
        moveBlocks();
        drawBullet();
        updateBullet();
        hitEnemy();
        if (canCollide) {
            checkCollision();
        }
        drawHealth();
        showAmmo();
        showScore();
    }
}



//glow effect
function setGlow() {
    // context.shadowColor = "#d53";
    context.shadowColor = "yellow";
    context.shadowBlur = 10;
}



function drawCar() {
    if (isCarImageLoaded) {
        if (isBlink && recentCollide) {
            context.drawImage(selectCars[1].carImg, car.x, car.y, car.width, car.height);
            setTimeout(() => {
                isBlink = false;
            }, 100);
            setTimeout(() => {
                isBlink = true;
            }, 300);
        }
        if (!recentCollide) {
            context.drawImage(selectCars[1].carImg, car.x, car.y, car.width, car.height);
        }
    }
}

//BULLETS
//draw bullet
function setBullet() {
    if (car.ammo > 0) {
        bullets.push({
            x: car.x + car.width / 2,
            y: car.y - initbullet.height,
            width: initbullet.width,
            height: initbullet.height,
            active: true
        })
        bulletSound.pause();
        bulletSound.currentTime = 0;
        bulletSound.play();
        canFireBullet = false;
        car.ammo--;
        setTimeout(() => {
            canFireBullet = true;
        }, 100);
    }
}

function drawBullet() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        if (bullet.active) {
            context.fillStyle = initbullet.color;
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }
}

function updateBullet() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        if (bullet.active) {
            bullet.y -= initbullet.speed;

            if (bullet.y < 0) {
                bullets.shift();
            }
        }
    }
}

//checking for whether bullet hiting enemy or not
function hitEnemy() {
    bullets.forEach((bullet, ibullet) => {
        blocks.forEach((block, iblock) => {
            if (isStrike(bullet, block)) {
                bullets.splice(ibullet, 1);
                block.health--;
                if (block.health <= 0 && block.type === "enemy") {
                    if (block.point === 2) {
                        score += 2;
                    }
                    if (block.point === 3) {
                        score += 3;
                    }
                    blocks.splice(iblock, 1);
                }
            }
        })
    })

}

// bullet hit car check
function isStrike(bullet, block) {
    if (
        (bullet.x + bullet.width >= block.x) &&
        bullet.x <= block.x + block.width &&
        (bullet.y + bullet.height >= block.y) &&
        bullet.y <= block.y + block.height
    ) {
        return true;
    }
    return false;
}

function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.y--;

        //removoing the bullets after it crosses the
        //top of the canvas
        if (bullet.y < 0) {
            bullets.shift();
        }
    }

    if (bullets[bullets.length - 1].y <= car.y + 50) {
        bullets.push({
            x: car.x + car.width / 2,
            y: car.y,
            width: 10,
            height: 10
        })
    }
}

//moving car left and right
function moveCarLeft() {
    if (car.x < 75) {
        car.x = 75;
    }
    car.x -= carFlexibility;
}

function moveCarRight() {
    if (car.x + car.width > street.x2 - 25) {
        car.x = street.x2 - car.width - 25;
    }
    car.x += carFlexibility;
}
function moveCarUp() {
    if (car.y < 25) {
        car.y = 25;
    }
    car.y -= carFlexibility;
}

function moveCarDown() {
    if (car.y + car.height > canvas.height - 25) {
        car.y = canvas.height - car.height - 25;
    }
    car.y += carFlexibility;
}

//draws obstacles 

//drawing car
const enemyImg1 = new Image();
enemyImg1.src = "./assets/white-enemy.png";

const enemyImg2 = new Image();
enemyImg2.src = "./assets/enemy-level2.png";

const enemyImg3 = new Image();
enemyImg3.src = "./assets/enemy-level3-1.png";

const lifeImg = new Image();
lifeImg.src = "./assets/heart.png";

const ammoImg = new Image();
ammoImg.src = "./assets/ammo.png";

function drawBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.level === 1) {
            context.drawImage(enemyImg1, block.x, block.y, block.width, block.height);
        }
        if (block.level === 2) {
            context.drawImage(enemyImg2, block.x, block.y, block.width, block.height);
        }
        if (block.level === 3) {
            context.drawImage(enemyImg3, block.x, block.y, block.width, block.height);
        }
        if (block.level === 4) {
            context.drawImage(lifeImg, block.x, block.y, block.width, block.height);
        }
        if (block.level === 5) {
            context.drawImage(ammoImg, block.x, block.y, block.width, block.height);
        }

    }
}

//moving the blocks
function moveBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (score > 49 && (score % 50 == 0 || score % 50 == 1) && canIncreaseSpeed) {
            increaseSpeed();
        }
        block.y += speed; //speed of the enemy

        //removoing the blocks after it crosses the
        //bottom of the canvas
        if (block.y > canvas.height + 50) {
            blocks.shift();
        }
    }

    if (blocks.length === 0 || blocks[blocks.length - 1].y >= 175) {

        const carPos = [80, 130, 180, 230, 280]
        const currPos = Math.floor(Math.random() * 5);
        //probability : 40% - level 1 enemy
        //probability : 30% - level 2 enemy
        //probability : 20% - level 3 enemy
        //probability : 5% - boost
        //probability : 5% - ammo
        const rIndex = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 4];
        const i = Math.floor(Math.random() * 20);

        blocks.push({
            x: carPos[currPos],
            y: -80,
            width: enemy[rIndex[i]].width,
            height: enemy[rIndex[i]].height,
            health: enemy[rIndex[i]].health,
            level: enemy[rIndex[i]].level,
            type: enemy[rIndex[i]].type,
            isCounted: false,
            damage: enemy[rIndex[i]].damage,
            point: enemy[rIndex[i]].point
        })
    }
}

//clears the canvas
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//checks the collision
function checkCollision() {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (
            (car.x + car.width >= block.x) &&
            car.x <= block.x + block.width &&
            (car.y + car.height >= block.y) &&
            car.y <= block.y + block.height

        ) {
            if (block.type === "boost" && car.healthStat < 9) {
                lifeSound.play();
                car.healthStat++;
                blocks.splice(i, 1);
            }
            if (block.type === "enemy") {
                carCrashSound.play();
                car.healthStat -= block.damage;
                blocks.splice(i, 1);
                car.x = car.initX;
                car.y = car.initY;
                recentCollide = true;
                canCollide = false;
                carSound();
                racingCarSound.play();
                setTimeout(() => {
                    recentCollide = false;
                    canCollide = true;
                }, 1800);
                break;
            }
            if (block.type === "ammo") {
                bulletCollectSound.play();
                car.ammo += 25;
                blocks.splice(i, 1);
            }

            canCollide = false;
            setTimeout(() => {
                canCollide = true;
            }, 500);

        }
    }
}

// score
function showScore() {
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (block.y >= canvas.height - 1 && !block.isCounted && block.type === "enemy") {
            block.isCounted = true;
            ++score;
        }
    }

    context.fillStyle = "#fff";
    context.font = "13px GameFont"
    context.fillText(`Score:${score}`, 20, 40);

}

//ammo

function showAmmo() {
    if (car.ammo <= 0) {
        if (isBlink) {
            context.fillStyle = "red";
            context.font = "13px GameFont"
            context.fillText(`Ammo:${car.ammo}`, 160, 40);
            setTimeout(() => {
                isBlink = false;
            }, 200);
            setTimeout(() => {
                isBlink = true;
            }, 500);
        }

    }
    else {
        context.fillStyle = "#fff";
        context.font = "13px GameFont"
        context.fillText(`Ammo:${car.ammo}`, 155, 40);
    }
}

//lane setting
//draw lane
function drawLanes() {
    for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];

        context.fillStyle = "#fff";
        context.fillRect(lane.x1, lane.y, lane.width, lane.height);
        context.fillRect(lane.x2, lane.y, lane.width, lane.height);
    }
}

//moving the lanes
function moveLanes() {
    for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];
        lane.y += envSpeed; //speed of the lane

        //removoing the lanes after it crosses the
        //bottom of the canvas
        if (lane.y > canvas.height) {
            lanes.shift();
        }
    }

    if (lanes.length === 0 || lanes[lanes.length - 1].y >= 10) {
        const laneXPos = [149, 259];
        const laneYPos = -100;

        lanes.push({
            x1: laneXPos[0],
            x2: laneXPos[1],
            y: laneYPos,
            width: 2,
            height: 75
        })
    }
}


//environment setting
//draw street elements
const treeImg = new Image();
treeImg.src = "./assets/tree1.png";

const bushImg = new Image();
bushImg.src = "./assets/bush1.png";

const houseImg = new Image();
houseImg.src = "./assets/house.png";

function drawTrees() {
    // street background
    context.fillStyle = "#00cc00";
    context.fillRect(street.x1, street.y, street.width, street.height);
    context.fillRect(street.x2, street.y, street.width, street.height);
    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];

        if (tree.type === "tree") {
            context.drawImage(treeImg, tree.x1, tree.y, tree.width, tree.height);
            context.drawImage(treeImg, tree.x2, tree.y, tree.width, tree.height);
        }
        if (tree.type === "bush") {
            context.drawImage(bushImg, tree.x1, tree.y, tree.width, tree.height);
            context.drawImage(bushImg, tree.x2, tree.y, tree.width, tree.height);
        }
        if (tree.type === "house") {
            context.drawImage(houseImg, tree.x1, tree.y, tree.width, tree.height);
            context.drawImage(houseImg, tree.x2, tree.y, tree.width, tree.height);
        }
    }
}

//moving the trees
function moveTrees() {
    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        tree.y += envSpeed; //speed of the tree

        //removoing the trees after it crosses the
        //bottom of the canvas
        if (tree.y > canvas.height) {
            trees.shift();
        }
    }

    if (trees.length === 0 || trees[trees.length - 1].y >= 10) {
        const treeXPos = [10, 360];
        const treeYPos = -100;

        // const rIndex = [0,1];
        const random = Math.floor(Math.random() * 3);

        trees.push({
            x1: treeXPos[0],
            x2: treeXPos[1],
            y: treeYPos,
            width: streetEle[random].width,
            height: streetEle[random].height,
            type: streetEle[random].type,
        })
    }
}

// increase speed funtion
function increaseSpeed() {
    speed += speed * (speedIncreasePercentage / 100);
    envSpeed += envSpeed * (speedIncreasePercentage / 100);
    canIncreaseSpeed = false;
    setTimeout(() => {
        canIncreaseSpeed = true
    }, 2000);
}

//car health
function drawHealth() {
    let heartPosX = 270;
    context.lineWidth = 2; //for stroke thickness
    switch (car.healthStat) {
        case 1:
            context.strokeStyle = "#ff0000";
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "#ff0000";
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            drawHeart(1, heartPosX);
            break;
        case 2:
            context.strokeStyle = "#ff0000";
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "#ff0000";
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            context.fillRect(battery.x2, battery.y, battery.width, battery.height);
            drawHeart(1, heartPosX);
            break;
        case 3:
            context.strokeStyle = "#ff0000";
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "#ff0000";
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            context.fillRect(battery.x2, battery.y, battery.width, battery.height);
            context.fillRect(battery.x3, battery.y, battery.width, battery.height);
            drawHeart(1, heartPosX);
            break;
        case 4:
            context.strokeStyle = "yellow";
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "yellow";
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            drawHeart(2, heartPosX);
            break;
        case 5:
            context.strokeStyle = "yellow";
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "yellow";
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            context.fillRect(battery.x2, battery.y, battery.width, battery.height);
            drawHeart(2, heartPosX);
            break;
        case 6:
            context.strokeStyle = "yellow";
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "yellow";
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            context.fillRect(battery.x2, battery.y, battery.width, battery.height);
            context.fillRect(battery.x3, battery.y, battery.width, battery.height);
            drawHeart(2, heartPosX);
            break;
        case 7:
            context.strokeStyle = "#00ff00"; //lime color
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "#00ff00";
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            drawHeart(3, heartPosX);
            break;
        case 8:
            context.strokeStyle = "#00ff00"; //lime color
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "#00ff00";
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            context.fillRect(battery.x2, battery.y, battery.width, battery.height);
            drawHeart(3, heartPosX);
            break;
        case 9:
            context.strokeStyle = "#00ff00"; //lime color
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "#00ff00";
            //3+16+3+16+3+16+3
            context.fillRect(battery.x1, battery.y, battery.width, battery.height);
            context.fillRect(battery.x2, battery.y, battery.width, battery.height);
            context.fillRect(battery.x3, battery.y, battery.width, battery.height);
            drawHeart(3, heartPosX);
            break;
        default:
            context.strokeStyle = "#ff0000";
            context.strokeRect(battery.outlineX, battery.outlineY, battery.outlineWidth, battery.outlineHeight);
            context.fillStyle = "#fff";
            context.font = "25px GameFont"
            context.fillText(`GAME OVER!`, 80, 300)
            gameStarted = false;
            gameOver = true;
            carSound();
            homeMusic.play();
            if (score > currhighScore) {
                localStorage.setItem("highScore", score);
                currhighScore = localStorage.getItem("highScore");
                context.fillStyle = "yellow";
                context.font = "20px GameFont"
                context.fillText(`NEW HIGHSCORE!`, 60, 350)
            }
            break;
    }

}

function drawHeart(num, x) {
    if (num > 0) {
        context.drawImage(heartImg, x, 50, 25, 25);
        drawHeart(--num, x + 25);
    }
}

function startPrompt() {
    context.fillStyle = "yellow";
    context.font = "25px GameFont"
    context.fillText(`PRESS ENTER`, 64, 250);
    context.fillStyle = "white"
    context.font = "20px GameFont"
    context.fillText(`High Score:${currhighScore}`, 64, 350);
    context.fillStyle = "yellow"
    context.font = "14px GameFont"
    context.fillText(`<- Select Your Car ->`, 55, 150);
}

//audio
function playMusic(){
    if(canPlayHomeMusic && !pauseMusic){
        homeMusic.play()
    }else if(!canPlayHomeMusic){
        homeMusic.pause();
        homeMusic.currentTime = 0;
        racingCarSound.play();
    }
}

function carSound(){
    racingCarSound.pause();
    racingCarSound.currentTime = 0;
}






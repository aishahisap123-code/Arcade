
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;


const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreDisplay = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");


let snake;
let food;
let direction;
let score;
let gameInterval;
let gameStarted = false;


let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreDisplay.textContent = highScore;


function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    gameStarted = false;

    scoreDisplay.textContent = score;
    spawnFood();
    draw();
}


function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}


function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "#39ff14";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, box, box);
    });

    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(food.x, food.y, box, box);
}


function update() {
    const head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // Wall collision
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasSize ||
        head.y >= canvasSize
    ) {
        endGame();
        return;
    }

    // Self collision
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}


function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    startScreen.classList.add("hidden");
    gameInterval = setInterval(update, 120);
}


function endGame() {
    clearInterval(gameInterval);

    finalScoreDisplay.textContent = "Score: " + score;

    // Save High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreDisplay.textContent = highScore;
    }

    gameOverScreen.classList.remove("hidden");
}


document.addEventListener("keydown", event => {

    if (!gameStarted &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        startGame();
    }

    if (event.key === "ArrowLeft" && direction !== "RIGHT")
        direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN")
        direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT")
        direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP")
        direction = "DOWN";
});


restartBtn.addEventListener("click", () => {
    gameOverScreen.classList.add("hidden");
    initGame();
});


initGame();

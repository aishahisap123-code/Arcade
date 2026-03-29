// CANVAS
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

// DOM
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreDisplay = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const nameInput = document.getElementById("nameInput");
const submitScoreBtn = document.getElementById("submitScoreBtn");

// GAME STATE
let snake;
let food;
let direction;
let score;
let gameInterval;
let gameStarted = false;

// HIGH SCORE
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreDisplay.textContent = highScore;

// INIT
function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    gameStarted = false;

    scoreDisplay.textContent = score;
    spawnFood();
    draw();
}

// FOOD
function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

// DRAW
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

// UPDATE
function update() {
    const head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // WALL COLLISION
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasSize ||
        head.y >= canvasSize
    ) {
        endGame();
        return;
    }

    // SELF COLLISION
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

// START GAME
function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    startScreen.classList.add("hidden");
    gameInterval = setInterval(update, 120);
}

//  SAVE SCORE (UPDATED LOGIC)
function saveScore(game, score, name) {
    if (!name) name = "Player";

    let scores = JSON.parse(localStorage.getItem(game)) || [];

    //  CHECK IF NAME EXISTS
    let existing = scores.find(s => s.name === name);

    if (existing) {
        // ONLY update if new score is higher
        if (score > existing.score) {
            existing.score = score;
        }
    } else {
        scores.push({ name, score });
    }

    // SORT
    scores.sort((a, b) => b.score - a.score);

    // LIMIT
    scores = scores.slice(0, 5);

    localStorage.setItem(game, JSON.stringify(scores));
}

// END GAME
function endGame() {
    clearInterval(gameInterval);

    finalScoreDisplay.textContent = "Score: " + score;

    // HIGH SCORE
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreDisplay.textContent = highScore;
    }

    gameOverScreen.classList.remove("hidden");
}

// CONTROLS
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

//  SUBMIT SCORE BUTTON
submitScoreBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();

    saveScore("snake", score, name);

    nameInput.value = "";
});

// ENTER KEY SUPPORT
nameInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        submitScoreBtn.click();
    }
});

// RESTART
restartBtn.addEventListener("click", () => {
    gameOverScreen.classList.add("hidden");
    initGame();
});

// GLOBAL MUSIC SYSTEM
const music = new Audio("../sounds/arcade.mp3");
music.loop = true;
music.volume = 0.3;

// LOAD STATE
let musicOn = localStorage.getItem("musicOn");

if (musicOn === null) {
    localStorage.setItem("musicOn", "true");
    musicOn = "true";
}

if (musicOn === "true") {
    music.play();
}

// TOGGLE FUNCTION
function toggleMusic() {
    if (music.paused) {
        music.play();
        localStorage.setItem("musicOn", "true");
    } else {
        music.pause();
        localStorage.setItem("musicOn", "false");
    }
}

// INIT
initGame();
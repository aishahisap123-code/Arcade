// CANVAS
const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

// DOM
const startMessage = document.getElementById("startMessage");
const scoreDisplay = document.getElementById("score");

// OVERLAY (WITH LEADERBOARD)
const gameOverOverlay = document.createElement("div");
gameOverOverlay.classList.add("overlay-screen", "hidden");

gameOverOverlay.innerHTML = `
<h2 id="endText"></h2>
<p id="finalScore"></p>
<input id="nameInput" placeholder="Enter name">
<button id="submitScoreBtn">SUBMIT</button>
<button id="restartBtn">RESTART</button>
`;

canvas.parentElement.appendChild(gameOverOverlay);

// ELEMENTS
const endText = document.getElementById("endText");
const finalScoreDisplay = document.getElementById("finalScore");
const nameInput = document.getElementById("nameInput");
const submitScoreBtn = document.getElementById("submitScoreBtn");
const restartBtn = document.getElementById("restartBtn");

// STATE
let playerX, bullets, enemies, score, gameRunning;

// CONTROLS
let left = false;
let right = false;

// INIT
function initGame() {
    playerX = canvas.width / 2 - 25;
    bullets = [];
    enemies = [];
    score = 0;

    // CREATE ENEMIES GRID
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 8; c++) {
            enemies.push({
                x: c * 60 + 40,
                y: r * 40 + 40,
                alive: true
            });
        }
    }

    scoreDisplay.textContent = score;
    gameRunning = false;

    draw();
}

// INPUT
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") left = true;
    if (e.key === "ArrowRight") right = true;

    if (e.key === " " && gameRunning) {
        bullets.push({ x: playerX + 22, y: 350 });
    }
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") left = false;
    if (e.key === "ArrowRight") right = false;
});

// DRAW
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#39ff14";

    // PLAYER
    ctx.fillRect(playerX, 370, 50, 10);

    // BULLETS
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));

    // ENEMIES
    enemies.forEach(e => {
        if (e.alive) ctx.fillRect(e.x, e.y, 30, 20);
    });
}

// UPDATE
function update() {
    if (!gameRunning) return;

    // PLAYER MOVEMENT
    if (left) playerX -= 5;
    if (right) playerX += 5;

    // CLAMP PLAYER
    if (playerX < 0) playerX = 0;
    if (playerX > canvas.width - 50) playerX = canvas.width - 50;

    // BULLETS
    bullets.forEach(b => b.y -= 5);

    // REMOVE OFF SCREEN BULLETS
    bullets = bullets.filter(b => b.y > 0);

    // ENEMIES MOVE DOWN
    enemies.forEach(e => {
        if (e.alive) e.y += 0.05;
    });

    // COLLISION
    bullets.forEach(b => {
        enemies.forEach(e => {
            if (
                e.alive &&
                b.x > e.x &&
                b.x < e.x + 30 &&
                b.y > e.y &&
                b.y < e.y + 20
            ) {
                e.alive = false;
                score += 10;
                scoreDisplay.textContent = score;
            }
        });
    });

    // LOSE CONDITION
    if (enemies.some(e => e.alive && e.y > 350)) {
        endGame("GAME OVER");
    }

    // WIN CONDITION
    if (enemies.every(e => !e.alive)) {
        endGame("YOU WIN!");
    }

    draw();
}

// LOOP
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// START
startMessage.addEventListener("click", () => {
    startMessage.classList.add("hidden");
    gameRunning = true;
});

// END GAME
function endGame(msg) {
    gameRunning = false;

    endText.textContent = msg;
    finalScoreDisplay.textContent = "Score: " + score;

    gameOverOverlay.classList.remove("hidden");

    canvas.dataset.score = score;
}

// SAVE SCORE
submitScoreBtn.addEventListener("click", () => {
    const name = nameInput.value;
    const score = parseInt(canvas.dataset.score);

    saveScore("invaders", score, name);

    submitScoreBtn.textContent = "Saved!";
});

// RESTART
restartBtn.addEventListener("click", () => {
    location.reload();
});

// LEADERBOARD
function saveScore(game, score, name) {
    if (!name) name = "Player";

    let scores = JSON.parse(localStorage.getItem(game)) || [];

    let existing = scores.find(s => s.name === name);

    if (existing) {
        if (score > existing.score) {
            existing.score = score;
        }
    } else {
        scores.push({ name, score });
    }

    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);

    localStorage.setItem(game, JSON.stringify(scores));
}

// SOUND
const music = new Audio("../sounds/arcade.mp3");
music.loop = true;
music.volume = 0.3;

let musicOn = localStorage.getItem("musicOn");

if (musicOn === null) {
    localStorage.setItem("musicOn", "true");
    musicOn = "true";
}

if (musicOn === "true") music.play();

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
gameLoop();
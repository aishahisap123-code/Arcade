// CANVAS
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

// DOM
const startMessage = document.getElementById("startMessage");
const scoreDisplay = document.getElementById("score");

// OVERLAY
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
let birdY, velocity, gravity, pipes, score, gameRunning;

// INIT
function initGame() {
    birdY = 250;
    velocity = 0;
    gravity = 0.5;
    pipes = [];
    score = 0;

    scoreDisplay.textContent = score;
    gameRunning = false;

    draw();
}

// CREATE PIPES
function createPipe() {
    const gap = 120;
    const topHeight = Math.random() * 200 + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        passed: false
    });
}

// CONTROLS
document.addEventListener("click", () => {
    if (!gameRunning) return;
    velocity = -8;
});

// DRAW
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#39ff14";

    // Bird
    ctx.fillRect(100, birdY, 20, 20);

    // Pipes
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 40, p.top);
        ctx.fillRect(p.x, p.bottom, 40, canvas.height);
    });
}

let pipeTimer = 0;
// UPDATE
function update() {
    if (!gameRunning) return;

    velocity += gravity;
    birdY += velocity;

    // PIPE SPAWN
    pipeTimer++;

    if (pipeTimer > 100) { // controls spacing
       createPipe();
       pipeTimer = 0;
    }


    pipes = pipes.filter(p => p.x > -50);
    
    pipes.forEach(p => {
        p.x -= 3;

        // SCORE
        if (!p.passed && p.x < 100) {
            score++;
            scoreDisplay.textContent = score;
            p.passed = true;
        }

        // COLLISION
        if (
            100 < p.x + 40 &&
            120 > p.x &&
            (birdY < p.top || birdY > p.bottom)
        ) {
            endGame("GAME OVER");
        }
    });

    // GROUND / CEILING
    if (birdY > canvas.height || birdY < 0) {
        endGame("GAME OVER");
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

// END
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

    saveScore("flappy", score, name);
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

// CANVAS 
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// DOM
const startMessage = document.getElementById("startMessage");
const playerScoreDisplay = document.getElementById("playerScore");

// CREATE GAME OVER SCREEN
const gameOverOverlay = document.createElement("div");
gameOverOverlay.classList.add("overlay-screen", "hidden", "pongy");

gameOverOverlay.innerHTML = `
    <h2 id="winnerText"></h2>
    <input id="nameInput" placeholder="Enter name">
    <button id="submitScoreBtn">SUBMIT</button>
    <button id="restartBtn">RESTART</button>
`;

canvas.parentElement.appendChild(gameOverOverlay);

// NOW get elements (AFTER creation)
const winnerText = document.getElementById("winnerText");
const nameInput = document.getElementById("nameInput");
const submitScoreBtn = document.getElementById("submitScoreBtn");
const restartBtn = document.getElementById("restartBtn");

// CONSTANTS
const paddleWidth = 12;
const paddleHeight = 100;
const ballSize = 12;
const winScore = 5;

// GAME STATE
let playerY, aiY, ballX, ballY, ballSpeedX, ballSpeedY;
let playerScore, aiScore;
let gameRunning = false;

// INIT
function initGame() {
    playerY = canvas.height / 2 - paddleHeight / 2;
    aiY = canvas.height / 2 - paddleHeight / 2;

    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    ballSpeedX = 4;
    ballSpeedY = 4;

    playerScore = 0;
    aiScore = 0;

    playerScoreDisplay.textContent = playerScore;
    gameRunning = false;
}

// RESET BALL
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// CONTROLS
document.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - paddleHeight / 2;
});

// DRAW
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#39ff14";

    ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - 22, aiY, paddleWidth, paddleHeight);
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    for (let i = 0; i < canvas.height; i += 20) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
    }

    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText(playerScore, canvas.width / 4, 40);
    ctx.fillText(aiScore, canvas.width * 3 / 4, 40);
}

// UPDATE
function update() {
    if (!gameRunning) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY *= -1;
    }

    if (ballX <= 22 && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX *= -1;
        let deltaY = ballY - (playerY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.15;
    }

    if (ballX >= canvas.width - 34 && ballY > aiY && ballY < aiY + paddleHeight) {
        ballSpeedX *= -1;
        let deltaY = ballY - (aiY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.15;
    }

    aiY += (ballY - (aiY + paddleHeight / 2)) * 0.08;

    if (ballX > canvas.width) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        resetBall();
    }

    if (ballX < 0) {
        aiScore++;
        resetBall();
    }

    if (playerScore >= winScore) endGame("YOU WIN!");
    if (aiScore >= winScore) endGame("AI WINS!");

    draw();
}

// LOOP
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// START
document.addEventListener("click", startGame);

function startGame() {
    if (gameRunning) return;

    startMessage.classList.add("hidden");
    gameRunning = true;

    document.removeEventListener("click", startGame);
}

// END GAME
function endGame(message) {
    gameRunning = false;

    winnerText.textContent = message;
    gameOverOverlay.classList.remove("hidden");

    canvas.dataset.score = playerScore;
}

// SAVE SCORE
submitScoreBtn.addEventListener("click", () => {
    const name = nameInput.value;
    const score = parseInt(canvas.dataset.score);

    saveScore("pong", score, name);
    submitScoreBtn.textContent = "Saved!";
});

// RESTART
restartBtn.addEventListener("click", () => {
    location.reload();
});

// LEADERBOARD FUNCTION
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

// SOUND SYSTEM
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

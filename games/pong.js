// ===== CANVAS =====
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// ===== DOM =====
const startMessage = document.getElementById("startMessage");

// Create Game Over overlay dynamically (so we don’t edit HTML again)
const gameOverOverlay = document.createElement("div");
gameOverOverlay.classList.add("overlay-screen", "hidden");
gameOverOverlay.innerHTML = `
    <h2 id="winnerText"></h2>
    <button id="restartBtn">RESTART</button>
`;
canvas.parentElement.appendChild(gameOverOverlay);

const winnerText = document.getElementById("winnerText");
const restartBtn = document.getElementById("restartBtn");
const playerScoreDisplay = document.getElementById("playerScore");

// ===== CONSTANTS =====
const paddleWidth = 12;
const paddleHeight = 100;
const ballSize = 12;
const winScore = 5;

// ===== GAME STATE =====
let playerY;
let aiY;
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;
let playerScore;
let aiScore;
let gameRunning = false;

// ===== INIT GAME =====
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

// ===== RESET BALL =====
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// ===== CONTROLS =====
document.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - paddleHeight / 2;
});

// ===== DRAW =====
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#39ff14";

    // Player paddle
    ctx.fillRect(10, playerY, paddleWidth, paddleHeight);

    // AI paddle
    ctx.fillRect(canvas.width - 22, aiY, paddleWidth, paddleHeight);

    // Ball
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // Center line
    for (let i = 0; i < canvas.height; i += 20) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
    }

    // Scores
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText(playerScore, canvas.width / 4, 40);
    ctx.fillText(aiScore, canvas.width * 3 / 4, 40);
}

// ===== UPDATE =====
function update() {
    if (!gameRunning) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall bounce
    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY *= -1;
    }

    // Player collision
    if (
        ballX <= 22 &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX *= -1;

        let deltaY = ballY - (playerY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.15;
    }

    // AI collision
    if (
        ballX >= canvas.width - 34 &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX *= -1;

        let deltaY = ballY - (aiY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.15;
    }

    // AI Movement (slightly imperfect so it’s beatable)
    aiY += (ballY - (aiY + paddleHeight / 2)) * 0.08;

    // Player scores
    if (ballX > canvas.width) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        resetBall();
    }

    // AI scores
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }

    // Win condition
    if (playerScore >= winScore) {
        endGame("YOU WIN!");
    }

    if (aiScore >= winScore) {
        endGame("AI WINS!");
    }

    draw();
}

// ===== GAME LOOP =====
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// ===== START GAME =====
canvas.addEventListener("click", () => {
    if (!gameRunning) {
        startMessage.classList.add("hidden");
        gameRunning = true;
    }
});

// ===== END GAME =====
function endGame(message) {
    gameRunning = false;

    winnerText.textContent = message;
    gameOverOverlay.classList.remove("hidden");
}

// ===== RESTART =====
restartBtn.addEventListener("click", () => {
    gameOverOverlay.classList.add("hidden");
    startMessage.classList.remove("hidden");
    initGame();
});

// ===== INITIALISE =====
initGame();
gameLoop();

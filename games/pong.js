const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const startMessage = document.getElementById("startMessage");

const gameOverOverlay = document.getElementById("div");
gameOverOverlay.classList.add("overlay-screen", "hidden");
gameOverOverlay.innerHTML = `
    <h2 id="winnerText"></h2>
    <button id="restartBtn">RESTART</button>
`;
canvas.parentElement.appendChild(gameOverOverlay);

const winnerText = document.getElementById("winnerText");
const restartBtn = document.getElementById("restartBtn");
const playerScoreDisplay = document.getElementById("playerScore");

const paddleWidth = 12;
const paddleHeight = 100;
const ballSize = 12;
const winScore = 5;

let playerY;
let aiY;
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;
let playerScore;
let aiScore;
let gameRunning = false;

function init() {
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

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

}
 document.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - paddleHeight / 2;
 });

function draw() {
    ctx.fillSyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height)

    ctx.fillStyle = "#39ff14";

    ctx.fillRect(10, playerY, paddleWidth, paddleHeight);

    ctx.fillRect(canvas.wifth - 22, aiY, paddleWidth, paddleHeight);

    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    for (let i = 0; i < canvas.height; i+= 20) {
        ctx.fillRect(canvas.width / 2-1, 1, 2, 10);
    }

    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText(playerScore, canvas.width / 4, 40);
    ctx.fillText(aiScore, canvas.width * 3 / 4, 40);

}

function update() {
    if (!gameRunning) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY *= -1;
    }

    if (
        ballX <= 22 &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX *= -1;

        let deltaY = ballY - (playerY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.15;
    }

    if (
        ballX >= canvas.width - 34 &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX *= -1;

        let deltaY = ballY - (aiY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.15;
    }

    aiY += (ballY - (aiY + paddleHeight / 2)) * 0.08;

    if (ballX > canvas.width) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        resetBall;
    }

    if (ballX < 0) {
        aiScore++;
        resetBall();
    }

    if (playerScore >= winScore) {
        endGame("YOU WIN!");
    }

    if (aiScore >= winScore) {
        endGame("AI WINS!");
    }

    draw();

}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", () => {
    if (!gameRunning) {
        startMessage.classList.add("hidden")
        gameRunning = true;
    }
});

function endGame(message) {
    gameRunning = false;

    winnerText.textContent = message;
    gameOverOverlay.classList.remove("hidden");
}

restartBtn.addEventListener("click", () => {
    gameOverOverlay.classList.add("hidden");
    startMessage.classList.remove("hidden");
    initGame();
});

initGame();
gameLoop();
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

 
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake;
let food;
let direction;
let score;
let gameInterval;
let gameOver = false;

function initGame() {
    snake = [
        { x: 9 * box, y: 10 * box }
    ];

    direction = null;
    score = 0;
    gameOver = false;

    spawnFood();

    document.getElementById("score").textContent = score;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(update, 120);
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
    if (!direction) {
        draw();
        return;
    }

    const head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    if (
        
    )
}
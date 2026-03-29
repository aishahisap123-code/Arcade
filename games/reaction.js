// CANVAS
const canvas = document.getElementById("reactionCanvas");
const ctx = canvas.getContext("2d");

// DOM
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalTimeDisplay = document.getElementById("finalTime");

const nameInput = document.getElementById("nameInput");
const submitScoreBtn = document.getElementById("submitScoreBtn");
const restartBtn = document.getElementById("restartBtn");

// GAME STATE
let waiting = false;
let ready = false;
let startTime;
let timeout;

// DRAW BOX
function draw(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// START GAME
function startGame() {
    startScreen.classList.add("hidden");

    draw("red");
    waiting = true;

    timeout = setTimeout(() => {
        draw("#39ff14");
        waiting = false;
        ready = true;
        startTime = Date.now();
    }, Math.random() * 3000 + 1000);
}

// CLICK HANDLER
canvas.addEventListener("click", () => {

    // CLICKED TOO EARLY
    if (waiting) {
        clearTimeout(timeout);
        endGame("Too early!");
        return;
    }

    // VALID CLICK
    if (ready) {
        let reactionTime = Date.now() - startTime;
        endGame(reactionTime + " ms", reactionTime);
    }
});

// END GAME
function endGame(text, score = null) {
    ready = false;
    waiting = false;

    finalTimeDisplay.textContent = text;
    gameOverScreen.classList.remove("hidden");

    // STORE SCORE TEMP
    canvas.dataset.score = score;
}

// SAVE SCORE (LEADERBOARD)
function saveScore(game, score, name) {
    if (!name) name = "Player";

    let scores = JSON.parse(localStorage.getItem(game)) || [];

    let existing = scores.find(s => s.name === name);

    if (existing) {
        // LOWER TIME = BETTER
        if (score < existing.score) {
            existing.score = score;
        }
    } else {
        scores.push({ name, score });
    }

    // SORT (LOWEST TIME FIRST)
    scores.sort((a, b) => a.score - b.score);

    scores = scores.slice(0, 5);

    localStorage.setItem(game, JSON.stringify(scores));
}

// SUBMIT SCORE
submitScoreBtn.addEventListener("click", () => {
    const score = parseInt(canvas.dataset.score);
    const name = nameInput.value;

    if (score) {
        saveScore("reaction", score, name);
        submitScoreBtn.textContent = "Saved!";
    }
});

// RESTART
restartBtn.addEventListener("click", () => {
    location.reload();
});

// START ON CLICK
startScreen.addEventListener("click", startGame);

// INITIAL DRAW
draw("black");

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
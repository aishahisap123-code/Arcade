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

function saveScore(game, score) {
    let name = prompt("Enter your name:");

    if (!name) name = "Player";

    let scores = JSON.parse(localStorage.getItem(game)) || [];

    scores.push({ name, score });

    scores.sort((a, b) => b.score - a.score);

    scores = scores.slice(0, 5);

    localStorage.setItem(game, JSON.stringify(scores));
}
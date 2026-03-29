const games = ["pong", "breakout", "invaders", "flappy", "snake", "reaction"];

games.forEach(game => {
    const list = document.getElementById(game);

    if (!list) return;

    let scores = JSON.parse(localStorage.getItem(game)) || [];

    if (scores.length === 0) {
        list.innerHTML = "<li>No scores yet</li>";
        return;
    }

    scores.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s.name + " - " + s.score;
        list.appendChild(li);
    });
});
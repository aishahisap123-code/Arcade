const soundButton = document.getElementById("soundToggle");
let soundOn = true;

soundButton.addEventListener("click", () => {
    soundOn = !soundOn;

    if (soundOn) {
        soundButton.textContent = "🔊 SOUND ON";
     } else {
        soundButton.textContent = "🔇 SOUND OFF";
     }
});

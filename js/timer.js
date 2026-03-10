let timeLeft = 25 * 60;
let timerId = null;

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-mins').innerText = `${m}:${s.toString().padStart(2, '0')}`;
}

document.getElementById('start-timer').onclick = function() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        this.innerText = "Focus";
    } else {
        this.innerText = "Pause";
        timerId = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerId);
                alert("Session Complete. Take a break.");
                timeLeft = 25 * 60;
                updateTimerDisplay();
            }
        }, 1000);
    }
};

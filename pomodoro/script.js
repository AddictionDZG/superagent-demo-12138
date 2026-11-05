const DURATIONS = {
  focus: 25 * 60,
  break: 5 * 60,
};

const labels = {
  focus: "专注",
  break: "休息",
};

const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const modeLabelElement = document.getElementById("mode-label");
const phaseDetailElement = document.getElementById("phase-detail");
const nextPhaseDetailElement = document.getElementById("next-phase-detail");
const progressBarElement = document.getElementById("progress-bar");
const startPauseButton = document.getElementById("start-pause-button");
const resetButton = document.getElementById("reset-button");

let currentMode = "focus";
let remainingSeconds = DURATIONS[currentMode];
let timerId = null;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function getNextMode(mode) {
  return mode === "focus" ? "break" : "focus";
}

function updateDisplay() {
  const { minutes, seconds } = formatTime(remainingSeconds);
  const phaseName = labels[currentMode];
  const nextPhaseName = labels[getNextMode(currentMode)];
  const totalDuration = DURATIONS[currentMode];
  const elapsed = totalDuration - remainingSeconds;
  const progress = totalDuration === 0 ? 0 : (elapsed / totalDuration) * 100;

  minutesElement.textContent = minutes;
  secondsElement.textContent = seconds;
  modeLabelElement.textContent = `${phaseName}中`;
  phaseDetailElement.textContent = phaseName;
  nextPhaseDetailElement.textContent = nextPhaseName;
  progressBarElement.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  document.title = `${minutes}:${seconds} · ${phaseName}`;
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }

  startPauseButton.textContent = "开始";
}

function switchMode() {
  currentMode = getNextMode(currentMode);
  remainingSeconds = DURATIONS[currentMode];
  updateDisplay();
}

function tick() {
  remainingSeconds -= 1;

  if (remainingSeconds <= 0) {
    switchMode();
    return;
  }

  updateDisplay();
}

function startTimer() {
  if (timerId !== null) {
    return;
  }

  startPauseButton.textContent = "暂停";
  timerId = window.setInterval(tick, 1000);
}

function resetTimer() {
  stopTimer();
  currentMode = "focus";
  remainingSeconds = DURATIONS[currentMode];
  updateDisplay();
}

startPauseButton.addEventListener("click", () => {
  if (timerId === null) {
    startTimer();
  } else {
    stopTimer();
  }
});

resetButton.addEventListener("click", resetTimer);

updateDisplay();

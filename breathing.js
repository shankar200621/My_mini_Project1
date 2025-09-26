let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");
let resumeBtn = document.getElementById("resumeBtn");
let resetBtn = document.getElementById("resetBtn");
let breathText = document.getElementById("breathText");
let circle = document.querySelector(".circle");
let timerDisplay = document.getElementById("timer");
let durationSelect = document.getElementById("duration");

let interval;
let elapsedInterval;
let paused = false;
let elapsedTime = 0;
let totalTime = 0;
let currentStep = 0;

const steps = [
  { text: "Inhale", scale: 1.3 },
  { text: "Hold", scale: 1.3 },
  { text: "Exhale", scale: 1.0 },
  { text: "Hold", scale: 1.0 }
];

function startBreathing() {
  resetBreathing(); // clear before start
  totalTime = parseInt(durationSelect.value) * 60;
  paused = false;
  elapsedInterval = setInterval(updateElapsed, 1000);
  runCycle();
}

function runCycle() {
  interval = setInterval(() => {
    if (!paused) {
      let step = steps[currentStep];
      breathText.textContent = step.text;
      circle.style.transform = `scale(${step.scale})`;
      currentStep = (currentStep + 1) % steps.length;
    }
  }, 4000); // 4s per step
}

function updateElapsed() {
  if (!paused) {
    elapsedTime++;
    let mins = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
    let secs = String(elapsedTime % 60).padStart(2, "0");
    timerDisplay.textContent = `${mins}:${secs}`;

    if (elapsedTime >= totalTime) {
      stopBreathing();
      breathText.textContent = "Session Complete 🎉";
    }
  }
}

function stopBreathing() {
  paused = true;
  breathText.textContent = "Paused ⏸️";
}

function resumeBreathing() {
  paused = false;
}

function resetBreathing() {
  clearInterval(interval);
  clearInterval(elapsedInterval);
  elapsedTime = 0;
  timerDisplay.textContent = "00:00";
  breathText.textContent = "Ready?";
  circle.style.transform = "scale(1)";
  paused = false;
  currentStep = 0;
}

startBtn.addEventListener("click", startBreathing);
stopBtn.addEventListener("click", stopBreathing);
resumeBtn.addEventListener("click", resumeBreathing);
resetBtn.addEventListener("click", resetBreathing);



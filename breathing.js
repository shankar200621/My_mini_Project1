const circle = document.getElementById('circle');
const instruction = document.getElementById('instruction');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const durationSelect = document.getElementById('duration');
const timeLeft = document.getElementById('timeLeft');

let interval;
let timerInterval;
let step = 0;
let remainingTime = 0;

const steps = [
  { text: 'Inhale deeply...', scale: 1.3 },
  { text: 'Hold your breath...', scale: 1.3 },
  { text: 'Exhale slowly...', scale: 1 }
];

function breathe() {
  const current = steps[step];
  instruction.textContent = current.text;
  circle.style.transform = `scale(${current.scale})`;
  step = (step + 1) % steps.length;
}

function updateTimerDisplay() {
  const mins = Math.floor(remainingTime / 60);
  const secs = remainingTime % 60;
  timeLeft.textContent = `Time left: ${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

function startBreathing() {
  step = 0;
  breathe();
  interval = setInterval(breathe, 4000);

  const selectedMinutes = parseInt(durationSelect.value);
  remainingTime = selectedMinutes * 60;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();
    if (remainingTime <= 0) {
      stopBreathing();
    }
  }, 1000);

  startBtn.disabled = true;
  stopBtn.disabled = false;
}

function stopBreathing() {
  clearInterval(interval);
  clearInterval(timerInterval);
  instruction.textContent = 'Click Start to begin...';
  timeLeft.textContent = '';
  circle.style.transform = 'scale(1)';
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

startBtn.addEventListener('click', startBreathing);
stopBtn.addEventListener('click', stopBreathing);

// Interactive Breathing Game (moved from mood-game2.js)
class InteractiveBreathing {
    constructor() {
        this.isActive = false;
        this.cycle = 0;
        this.breathingCycle = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
        this.cycleIndex = 0;
        this.interval = null;

        this.init();
    }

    init() {
        this.circle = document.getElementById('breathing-circle');
        this.text = document.getElementById('breathing-text');
        this.startBtn = document.getElementById('breathing-start');
        this.stopBtn = document.getElementById('breathing-stop');

        if (this.startBtn && this.stopBtn) {
            this.startBtn.addEventListener('click', () => this.startBreathing());
            this.stopBtn.addEventListener('click', () => this.stopBreathing());
        }
    }

    startBreathing() {
        this.isActive = true;
        this.cycleIndex = 0;
        this.startBtn.style.display = 'none';
        this.stopBtn.style.display = 'inline-block';
        this.breathingLoop();
    }

    stopBreathing() {
        this.isActive = false;
        clearInterval(this.interval);
        this.circle.style.transform = 'scale(1)';
        this.text.textContent = 'Click to start';
        this.startBtn.style.display = 'inline-block';
        this.stopBtn.style.display = 'none';
    }

    breathingLoop() {
        if (!this.isActive) return;

        const durations = [4000, 2000, 4000, 2000]; // 4s in, 2s hold, 4s out, 2s hold
        const scales = [1.2, 1.2, 1, 1];

        this.text.textContent = this.breathingCycle[this.cycleIndex];
        this.circle.style.transform = `scale(${scales[this.cycleIndex]})`;
        this.circle.style.transition = `transform ${durations[this.cycleIndex]}ms ease-in-out`;

        this.cycleIndex = (this.cycleIndex + 1) % this.breathingCycle.length;

        this.interval = setTimeout(() => this.breathingLoop(), durations[this.cycleIndex - 1] || durations[3]);
    }
}

// Initialize interactive breathing when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveBreathing();
});

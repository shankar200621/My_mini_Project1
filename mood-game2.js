// Memory Match Game
class MemoryGame {
    constructor() {
        this.cards = ['🧠', '💚', '🌱', '☀️', '🌙', '⭐', '🦋', '🌸'];
        this.gameCards = [...this.cards, ...this.cards].sort(() => Math.random() - 0.5);
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.gameActive = false;

        this.init();
    }

    init() {
        this.grid = document.getElementById('memory-grid');
        this.movesDisplay = document.getElementById('memory-moves');
        this.timeDisplay = document.getElementById('memory-time');
        this.startBtn = document.getElementById('memory-start');

        this.startBtn.addEventListener('click', () => this.startGame());
    }

    startGame() {
        this.gameActive = true;
        this.startTime = Date.now();
        this.moves = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.updateDisplay();
        this.createGrid();
        this.startTimer();
    }

    createGrid() {
        this.grid.innerHTML = '';
        this.gameCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            cardElement.innerHTML = '<span class="card-back">?</span><span class="card-front">' + card + '</span>';
            cardElement.addEventListener('click', () => this.flipCard(cardElement, index));
            this.grid.appendChild(cardElement);
        });
    }

    flipCard(cardElement, index) {
        if (!this.gameActive || this.flippedCards.length >= 2 || cardElement.classList.contains('flipped')) return;

        cardElement.classList.add('flipped');
        this.flippedCards.push({ element: cardElement, index, value: this.gameCards[index] });

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.value === card2.value) {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            this.matchedPairs++;

            if (this.matchedPairs === this.cards.length) {
                this.gameComplete();
            }
        } else {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
        }

        this.flippedCards = [];
    }

    gameComplete() {
        this.gameActive = false;
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        alert(`🎉 Congratulations! You completed the game in ${this.moves} moves and ${timeElapsed} seconds!`);
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (this.gameActive) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.timeDisplay.textContent = elapsed + 's';
            }
        }, 1000);
    }

    updateDisplay() {
        this.movesDisplay.textContent = this.moves;
    }
}

// Word Puzzle Game
class WordPuzzle {
    constructor() {
        this.words = [
            { word: 'CALM', hint: 'A peaceful state of mind' },
            { word: 'PEACE', hint: 'Freedom from disturbance' },
            { word: 'JOY', hint: 'A feeling of great pleasure' },
            { word: 'HOPE', hint: 'Optimistic feeling about the future' },
            { word: 'LOVE', hint: 'Deep affection for someone' },
            { word: 'SMILE', hint: 'A happy facial expression' },
            { word: 'DREAM', hint: 'A series of thoughts during sleep' },
            { word: 'BRAVE', hint: 'Ready to face danger or pain' }
        ];
        this.currentWord = null;
        this.scrambledWord = '';
        this.score = 0;
        this.streak = 0;

        this.init();
    }

    init() {
        this.wordDisplay = document.getElementById('puzzle-word');
        this.hintDisplay = document.getElementById('puzzle-hint');
        this.input = document.getElementById('puzzle-input');
        this.submitBtn = document.getElementById('puzzle-submit');
        this.scoreDisplay = document.getElementById('puzzle-score');
        this.streakDisplay = document.getElementById('puzzle-streak');
        this.newBtn = document.getElementById('puzzle-new');
        this.hintBtn = document.getElementById('puzzle-hint-btn');

        this.newBtn.addEventListener('click', () => this.newWord());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.submitBtn.addEventListener('click', () => this.submitAnswer());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });

        this.newWord();
    }

    newWord() {
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.scrambledWord = this.scrambleWord(this.currentWord.word);
        this.wordDisplay.textContent = this.scrambledWord;
        this.hintDisplay.textContent = '';
        this.input.value = '';
        this.hintBtn.disabled = false;
        this.input.focus();
    }

    scrambleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5).join('');
    }

    showHint() {
        this.hintDisplay.textContent = this.currentWord.hint;
        this.hintBtn.disabled = true;
    }

    submitAnswer() {
        const answer = this.input.value.trim();
        if (!answer) return;

        if (this.checkAnswer(answer)) {
            this.showFeedback('Correct! 🎉', 'success');
            setTimeout(() => this.newWord(), 1500);
        } else {
            this.showFeedback('Try again! 💪', 'error');
        }
    }

    checkAnswer(answer) {
        if (answer.toUpperCase() === this.currentWord.word) {
            this.score += 10;
            this.streak++;
            this.updateDisplay();
            return true;
        } else {
            this.streak = 0;
            this.updateDisplay();
            return false;
        }
    }

    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `puzzle-feedback ${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 1000;
      animation: fadeInOut 1.5s ease-in-out;
    `;

        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 1500);
    }

    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.streakDisplay.textContent = this.streak;
    }
}

// Stress Ball Game
class StressBall {
    constructor() {
        this.squeezeCount = 0;
        this.startTime = null;
        this.isActive = false;
        this.timer = null;

        this.init();
    }

    init() {
        this.ball = document.getElementById('stress-ball');
        this.countDisplay = document.getElementById('squeeze-count');
        this.timeDisplay = document.getElementById('stress-time');
        this.resetBtn = document.getElementById('stress-reset');

        this.ball.addEventListener('mousedown', () => this.squeeze());
        this.ball.addEventListener('mouseup', () => this.release());
        this.ball.addEventListener('mouseleave', () => this.release());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.startTimer();
    }

    squeeze() {
        if (!this.isActive) {
            this.isActive = true;
            this.startTime = Date.now();
        }

        this.squeezeCount++;
        this.ball.style.transform = 'scale(0.8)';
        this.ball.style.backgroundColor = '#ff6b6b';
        this.countDisplay.textContent = this.squeezeCount;
    }

    release() {
        this.ball.style.transform = 'scale(1)';
        this.ball.style.backgroundColor = '#4ecdc4';
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (this.isActive) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.timeDisplay.textContent = elapsed + 's';
            }
        }, 1000);
    }

    reset() {
        this.squeezeCount = 0;
        this.isActive = false;
        this.startTime = null;
        this.countDisplay.textContent = '0';
        this.timeDisplay.textContent = '0s';
        this.ball.style.transform = 'scale(1)';
        this.ball.style.backgroundColor = '#4ecdc4';
    }
}

// Color Therapy Game
class ColorTherapy {
    constructor() {
        this.isDrawing = false;
        this.currentColor = '#ff6b6b';

        this.init();
    }

    init() {
        this.canvas = document.getElementById('color-canvas');
        this.colorOptions = document.querySelectorAll('.color-option');
        this.clearBtn = document.getElementById('color-clear');

        this.colorOptions.forEach(option => {
            option.addEventListener('click', () => this.selectColor(option.dataset.color));
        });

        this.clearBtn.addEventListener('click', () => this.clearCanvas());
        this.setupCanvas();
    }

    selectColor(color) {
        this.currentColor = color;
        this.colorOptions.forEach(option => option.classList.remove('selected'));
        event.target.classList.add('selected');
    }

    setupCanvas() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.draw(e);
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dot = document.createElement('div');
        dot.className = 'color-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.backgroundColor = this.currentColor;

        this.canvas.appendChild(dot);
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearCanvas() {
        this.canvas.innerHTML = '';
    }
}

// Gratitude Journal
class GratitudeJournal {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('gratitudeEntries') || '[]');
        this.prompts = [
            "What made you smile today?",
            "Who are you grateful for?",
            "What small thing brought you joy?",
            "What are you proud of today?",
            "What beauty did you notice today?"
        ];

        this.init();
    }

    init() {
        this.prompt = document.getElementById('gratitude-prompt');
        this.input = document.getElementById('gratitude-input');
        this.entriesContainer = document.getElementById('gratitude-entries');
        this.addBtn = document.getElementById('gratitude-add');

        this.addBtn.addEventListener('click', () => this.addEntry());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.addEntry();
            }
        });

        this.showRandomPrompt();
        this.displayEntries();
    }

    showRandomPrompt() {
        const randomPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        this.prompt.querySelector('h3').textContent = randomPrompt;
    }

    addEntry() {
        const text = this.input.value.trim();
        if (!text) return;

        const entry = {
            id: Date.now(),
            text: text,
            date: new Date().toLocaleDateString(),
            prompt: this.prompt.querySelector('h3').textContent
        };

        this.entries.unshift(entry);
        this.saveEntries();
        this.displayEntries();
        this.input.value = '';
        this.showRandomPrompt();
    }

    displayEntries() {
        this.entriesContainer.innerHTML = '';

        this.entries.slice(0, 5).forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'gratitude-entry';
            entryElement.innerHTML = `
        <div class="entry-date">${entry.date}</div>
        <div class="entry-text">${entry.text}</div>
      `;
            this.entriesContainer.appendChild(entryElement);
        });
    }

    saveEntries() {
        localStorage.setItem('gratitudeEntries', JSON.stringify(this.entries));
    }
}

// Initialize all games when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
    new WordPuzzle();
    new ColorTherapy();
    new GratitudeJournal();
    new StressBall();
});

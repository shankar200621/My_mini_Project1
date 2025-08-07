const moods = ['😊', '😔', '😠', '😨', '🥰', '😎', '😢', '🤔'];
let cards = [];
let firstCard = null;
let lockBoard = false;
let matchCount = 0;

const board = document.getElementById('game-board');
const matchCounter = document.getElementById('match-count');
const message = document.getElementById('game-message');
const restartBtn = document.getElementById('restart-btn');

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createCard(content) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.mood = content;
  card.innerHTML = "❓";

  card.addEventListener('click', () => {
    if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.innerHTML = content;
    card.classList.add('flipped');

    if (!firstCard) {
      firstCard = card;
    } else {
      if (firstCard.dataset.mood === card.dataset.mood) {
        firstCard.classList.add('matched');
        card.classList.add('matched');
        matchCount++;
        updateScore();
        firstCard = null;

        if (matchCount === moods.length) {
          showMessage();
        }
      } else {
        lockBoard = true;
        setTimeout(() => {
          firstCard.innerHTML = "❓";
          card.innerHTML = "❓";
          firstCard.classList.remove('flipped');
          card.classList.remove('flipped');
          firstCard = null;
          lockBoard = false;
        }, 900);
      }
    }
  });

  return card;
}

function initializeGame() {
  board.innerHTML = '';
  matchCount = 0;
  updateScore();
  message.textContent = '';
  cards = shuffle([...moods, ...moods]);

  cards.forEach(mood => {
    const cardElement = createCard(mood);
    board.appendChild(cardElement);
  });
}

function updateScore() {
  matchCounter.textContent = matchCount;
}

function showMessage() {
  const quotes = [
    "You’re amazing — keep taking care of yourself 🌱",
    "Every step matters. Great job! 💪",
    "Your mind is powerful — treat it kindly 🧠💖",
    "This was more than a game — it's self-care 🌈"
  ];
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  message.innerHTML = `<br><strong>${random}</strong>`;
}

restartBtn.addEventListener('click', initializeGame);
initializeGame();

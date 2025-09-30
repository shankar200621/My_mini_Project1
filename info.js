// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(theme) {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = storedTheme || (prefersDark ? 'dark' : 'light');

setTheme(defaultTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// FAQ Accordion Script
const faqQuestions = document.querySelectorAll('.faq-question');
const faqAnswers = document.querySelectorAll('.faq-answer');

// Initialize: do not use the hidden attribute to avoid flicker
faqAnswers.forEach(ans => {
  ans.removeAttribute('hidden');
  ans.style.maxHeight = '0';
});

faqQuestions.forEach(questionButton => {
  questionButton.addEventListener('click', () => {
    const currentAnswer = questionButton.nextElementSibling;
    const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

    // Close all others
    faqQuestions.forEach(otherButton => {
      if (otherButton !== questionButton) {
        otherButton.setAttribute('aria-expanded', 'false');
        const otherAnswer = otherButton.nextElementSibling;
        if (otherAnswer) {
          otherAnswer.style.maxHeight = '0';
        }
      }
    });

    // Toggle current
    if (isExpanded) {
      questionButton.setAttribute('aria-expanded', 'false');
      currentAnswer.style.maxHeight = '0';
    } else {
      questionButton.setAttribute('aria-expanded', 'true');
      // Set to its scrollHeight so it animates open to the full content
      currentAnswer.style.maxHeight = currentAnswer.scrollHeight + 'px';
    }
  });
});

// Search Functionality
const searchInput = document.getElementById('faq-search');
const clearSearch = document.getElementById('clear-search');
const faqItems = document.querySelectorAll('.faq-item');

function filterFAQs(query) {
  const lowerQuery = query.toLowerCase();
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question').textContent.toLowerCase();
    const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
    const matches = question.includes(lowerQuery) || answer.includes(lowerQuery);
    item.style.display = matches ? 'block' : 'none';
  });
}

searchInput.addEventListener('input', (e) => {
  filterFAQs(e.target.value);
  clearSearch.style.display = e.target.value ? 'block' : 'none';
});

clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  filterFAQs('');
  clearSearch.style.display = 'none';
  searchInput.focus();
});

// Navbar Elevation on Scroll
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    navbar.classList.add('elevated');
  } else {
    navbar.classList.remove('elevated');
  }
  lastScrollY = window.scrollY;
});

// Tip of the day
(function initTipOfDay() {
  const el = document.getElementById('tip-of-day-text');
  if (!el) return;
  const tips = [
    'Take 3 slow breaths before you reply.',
    'Step outside for 2 minutes of daylight.',
    'Write one thing you’re grateful for.',
    'Drink a glass of water and stretch.',
    'Mute non‑essential notifications for an hour.',
    'Name what you feel: “I feel … because …”.',
    'Tiny wins count. Celebrate one small win today.',
  ];
  try {
    const day = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('tip_of_day') || '{}');
    if (saved.day === day && typeof saved.tip === 'string') {
      el.textContent = saved.tip;
      return;
    }
  } catch { }
  const tip = tips[Math.floor(Math.random() * tips.length)];
  el.textContent = tip;
  try { localStorage.setItem('tip_of_day', JSON.stringify({ day: new Date().toDateString(), tip })); } catch { }
})();



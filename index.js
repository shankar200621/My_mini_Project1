// Time-based greeting (runs only if element exists)
function setGreeting() {
  const greetingEl = document.getElementById("greeting");
  if (!greetingEl) return;
  const hour = new Date().getHours();
  if (hour < 12) {
    greetingEl.textContent = "🌞 Good Morning! Welcome to MindCare";
  } else if (hour < 18) {
    greetingEl.textContent = "☀️ Good Afternoon! Welcome to MindCare";
  } else {
    greetingEl.textContent = "🌙 Good Evening! Welcome to MindCare";
  }
}

// Motivational quotes
const quotes = [
  "Breathe. Relax. You are exactly where you need to be.",
  "Peace begins with a deep breath.",
  "Your mind is a garden. Nurture it with care.",
  "One small positive thought can change your whole day.",
  "You deserve rest, peace, and self-care."
];

let quoteIndex = 0;
function rotateQuotes() {
  const quoteEl = document.getElementById("quote");
  if (!quoteEl) return;
  quoteEl.style.opacity = 0;
  setTimeout(() => {
    quoteEl.textContent = quotes[quoteIndex];
    quoteEl.style.opacity = 1;
    quoteIndex = (quoteIndex + 1) % quotes.length;
  }, 500);
}

// Initialize
setGreeting();
rotateQuotes();
if (document.getElementById("quote")) {
  setInterval(rotateQuotes, 7000); // change every 7 seconds
}

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
function updateNavbarShadow() {
  if (!navbar) return;
  const shouldElevate = window.scrollY > 4;
  navbar.classList.toggle('elevated', shouldElevate);
}
window.addEventListener('scroll', updateNavbarShadow, { passive: true });
updateNavbarShadow();

// Theme: dark mode with system preference and toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

function getSystemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  } else {
    applyTheme(getSystemPrefersDark() ? 'dark' : 'light');
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-transition');
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (_) { }
    requestAnimationFrame(() => {
      setTimeout(() => document.documentElement.classList.remove('theme-transition'), 350);
    });
  });
}

initTheme();

// FAQ toggles (progressive enhancement)
document.querySelectorAll('.faq-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const controls = btn.getAttribute('aria-controls');
    const panel = controls ? document.getElementById(controls) : null;
    btn.setAttribute('aria-expanded', String(!expanded));
    if (panel) {
      if (expanded) {
        panel.hidden = true;
      } else {
        panel.hidden = false;
      }
    }
  });
});
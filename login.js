// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function toggleTheme() {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
themeToggle.addEventListener('click', toggleTheme);

// Password toggle
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  this.textContent = type === 'password' ? '👁' : '🙈';
});

// Form validation and submission
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInputAgain = document.getElementById('password');
const rememberMe = document.getElementById('rememberMe');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.querySelector('.btn-text');
const loadingSpinner = document.querySelector('.loading-spinner');
const errorMessage = document.getElementById('errorMessage');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Load remembered email
const rememberedEmail = localStorage.getItem('rememberedEmail');
if (rememberedEmail) {
  emailInput.value = rememberedEmail;
  rememberMe.checked = true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

function hideError(element) {
  element.textContent = '';
  element.style.display = 'none';
}

function validateForm() {
  let isValid = true;

  // Email validation
  if (!emailInput.value.trim()) {
    showError(emailError, 'Email is required');
    isValid = false;
  } else if (!validateEmail(emailInput.value)) {
    showError(emailError, 'Please enter a valid email');
    isValid = false;
  } else {
    hideError(emailError);
  }

  // Password validation
  if (!passwordInputAgain.value.trim()) {
    showError(passwordError, 'Password is required');
    isValid = false;
  } else if (passwordInputAgain.value.length < 6) {
    showError(passwordError, 'Password must be at least 6 characters');
    isValid = false;
  } else {
    hideError(passwordError);
  }

  return isValid;
}

loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  // Show loading state
  loginBtn.disabled = true;
  btnText.textContent = 'Logging in...';
  loadingSpinner.style.display = 'inline';
  errorMessage.style.display = 'none';

  // Simulate login delay (replace with actual API call)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simple demo login: accept any email/password for demo
  const email = emailInput.value;
  const password = passwordInputAgain.value;

  // For demo, always "succeed" login
  if (email && password) {
    // Remember email if checked
    if (rememberMe.checked) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Redirect to index.html or wherever
    window.location.href = 'index.html';
  } else {
    showError(errorMessage, 'Invalid credentials. Please try again.');
  }

  // Reset loading state
  loginBtn.disabled = false;
  btnText.textContent = 'Login';
  loadingSpinner.style.display = 'none';
});

// Real-time validation
emailInput.addEventListener('input', () => {
  if (emailInput.value.trim() && !validateEmail(emailInput.value)) {
    showError(emailError, 'Please enter a valid email');
  } else {
    hideError(emailError);
  }
});

passwordInputAgain.addEventListener('input', () => {
  if (passwordInputAgain.value.trim() && passwordInputAgain.value.length < 6) {
    showError(passwordError, 'Password must be at least 6 characters');
  } else {
    hideError(passwordError);
  }
});

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  if (email === "test@mindcare.com" && password === "1234") {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "dashboard.html"; // Placeholder
  } else {
    errorMsg.textContent = "Invalid credentials. Try: test@mindcare.com / 1234";
  }
});

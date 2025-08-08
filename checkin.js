const questions = [
  {
    question: "How are you feeling emotionally today?",
    options: ["Great", "Okay", "Stressed", "Anxious"]
  },
  {
    question: "How well did you sleep last night?",
    options: ["Very Well", "Somewhat", "Poorly", "Didn't sleep"]
  },
  {
    question: "Do you feel supported by those around you?",
    options: ["Yes, absolutely", "Sometimes", "Not really", "I feel alone"]
  },
  {
    question: "How often do you feel overwhelmed?",
    options: ["Rarely", "Sometimes", "Often", "Always"]
  },
  {
    question: "How motivated do you feel today?",
    options: ["Very motivated", "Somewhat", "Not much", "Not at all"]
  },
  {
    question: "Are you able to take time for yourself?",
    options: ["Yes", "Occasionally", "Rarely", "Never"]
  }
];

let currentIndex = 0;
let answers = Array(questions.length).fill(null);

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");
const skipBtn = document.getElementById("skip-btn");
const progressFill = document.getElementById("progress-fill");

function loadQuestion(index) {
  const current = questions[index];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";
  nextBtn.disabled = !answers[index];

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    if (answers[index] === option) {
      btn.classList.add("selected");
      nextBtn.disabled = false;
    }
    btn.onclick = () => {
      answers[index] = option;
      document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      nextBtn.disabled = false;
    };
    optionsEl.appendChild(btn);
  });

  progressFill.style.width = `${(index / questions.length) * 100}%`;
  backBtn.disabled = index === 0;
}

function calculateResult() {
  let score = 0;

  answers.forEach(answer => {
    switch (answer) {
      case "Great":
      case "Very Well":
      case "Yes, absolutely":
      case "Rarely":
      case "Very motivated":
      case "Yes":
        score += 3; break;
      case "Okay":
      case "Somewhat":
      case "Sometimes":
      case "Occasionally":
        score += 2; break;
      case "Stressed":
      case "Poorly":
      case "Not really":
      case "Often":
      case "Not much":
        score += 1; break;
      case "Anxious":
      case "Didn't sleep":
      case "I feel alone":
      case "Always":
      case "Not at all":
      case "Never":
        score += 0; break;
    }
  });

  let result = "", suggestions = "", diet = "";

  if (score >= 15) {
    result = "You're doing well overall!";
    suggestions = "✅ Keep journaling or practicing mindfulness.<br>✅ Stay connected with supportive people.<br>✅ Continue doing activities you love.";
    diet = "🥗 Try including fresh fruits, leafy greens, and omega-3 rich foods like walnuts and salmon.";
  } else if (score >= 9) {
    result = "You're experiencing some stress. Take gentle steps.";
    suggestions = "💡 Try a short walk or deep breathing today.<br>💡 Set small goals and reward yourself.<br>💡 Talk to a friend about how you’re feeling.";
    diet = "🍵 Try herbal teas, bananas, oats, and dark chocolate to uplift mood and calm nerves.";
  } else {
    result = "It seems you're struggling. You're not alone.";
    suggestions = "🧠 Reach out to a counselor or trusted person.<br>🧠 Write down your emotions to better understand them.<br>🧠 Consider mindfulness or guided meditations.";
    diet = "🍲 Add warm, nutritious meals like soups, complex carbs, and vitamin-B-rich foods like eggs and lentils.";
  }

  return { result, suggestions, diet };
}

function showResult() {
  questionEl.textContent = "Thank you for checking in 💚";
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
  backBtn.style.display = "none";
  skipBtn.style.display = "none";
  progressFill.style.width = "100%";

  const { result, suggestions, diet } = calculateResult();
  const resultEl = document.createElement("div");
  resultEl.classList.add("final-result");
  resultEl.innerHTML = `
    <h3>Your Mental Health Status:</h3>
    <p>${result}</p>
    <div class="suggestions">
      <h4>Suggestions for You:</h4>
      <p>${suggestions}</p>
      <h4>Recommended Diet Tips:</h4>
      <p>${diet}</p>
    </div>`;
  optionsEl.appendChild(resultEl);
}

nextBtn.addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion(currentIndex);
  } else {
    showResult();
  }
});

backBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion(currentIndex);
  }
});

skipBtn.addEventListener("click", () => {
  answers[currentIndex] = null;
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion(currentIndex);
  } else {
    showResult();
  }
});

// Initial load
loadQuestion(currentIndex);

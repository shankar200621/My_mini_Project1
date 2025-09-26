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
  },
  // New questions added for a more complete snapshot
  {
    question: "How is your energy level today?",
    options: ["High", "Moderate", "Low", "Very low"]
  },
  {
    question: "How often have you felt sad or down this week?",
    options: ["Rarely", "Sometimes", "Often", "Always"]
  },
  {
    question: "How well are you able to focus today?",
    options: ["Great", "Okay", "Not much", "Not at all"]
  },
  {
    question: "How comfortable are you sharing your feelings with someone you trust?",
    options: ["Yes, absolutely", "Sometimes", "Not really", "I feel alone"]
  },
  {
    question: "Over the past few days, how restful have you felt?",
    options: ["Very Well", "Somewhat", "Poorly", "Didn't sleep"]
  },
  {
    question: "How often did you do something kind for yourself this week?",
    options: ["Often", "Sometimes", "Rarely", "Never"]
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
const progressLabel = document.getElementById("progress-label");
const srStatus = document.getElementById("sr-status");

function loadQuestion(index) {
  const current = questions[index];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";
  nextBtn.disabled = !answers[index];
  questionEl.focus && questionEl.focus();

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    btn.type = "button";
    if (answers[index] === option) {
      btn.classList.add("selected");
      nextBtn.disabled = false;
    }
    btn.onclick = () => {
      answers[index] = option;
      document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      nextBtn.disabled = false;
      if (srStatus) srStatus.textContent = `Selected: ${option}`;
    };
    optionsEl.appendChild(btn);
  });

  progressFill.style.width = `${(index / questions.length) * 100}%`;
  backBtn.disabled = index === 0;
  if (progressLabel) progressLabel.textContent = `Question ${index + 1} of ${questions.length}`;
}

function calculateResult() {
  let score = 0;

  answers.forEach(answer => {
    switch (answer) {
      // 3 points (protective/positive)
      case "Great":
      case "Very Well":
      case "Yes, absolutely":
      case "Rarely":
      case "Very motivated":
      case "Yes":
      case "High":
      case "Often": // for self-care frequency
        score += 3; break;
      // 2 points (neutral/moderate)
      case "Okay":
      case "Somewhat":
      case "Sometimes":
      case "Occasionally":
      case "Moderate":
        score += 2; break;
      // 1 point (mild difficulties)
      case "Stressed":
      case "Poorly":
      case "Not really":
      case "Often": // when used in negative questions
      case "Not much":
      case "Low":
        score += 1; break;
      // 0 points (severe difficulties)
      case "Anxious":
      case "Didn't sleep":
      case "I feel alone":
      case "Always":
      case "Not at all":
      case "Never":
      case "Very low":
        score += 0; break;
    }
  });

  const maxScore = questions.length * 3;
  const ratio = maxScore ? (score / maxScore) : 0;

  let result = "", suggestions = "", diet = "";

  if (ratio >= 0.75) {
    result = "You're doing well overall — keep nurturing your wellbeing.";
    suggestions = [
      "Maintain routines that work: short walks, consistent sleep, screen breaks.",
      "Keep social connections active; share wins and challenges.",
      "Consider journaling or gratitude notes 3×/week."
    ].map(s => `✅ ${s}`).join('<br>');
    diet = [
      "Colorful plate: leafy greens, berries, carrots (antioxidants).",
      "Healthy fats: olive oil, nuts, seeds, fatty fish (omega‑3).",
      "Stay hydrated; add herbal teas (chamomile, peppermint)."
    ].map(s => `🥗 ${s}`).join('<br>');
  } else if (ratio >= 0.45) {
    result = "You're experiencing some stress — small consistent steps will help.";
    suggestions = [
      "Try 5–10 minutes of breathing or body scan today.",
      "Pick one small, doable task and celebrate completion.",
      "Talk to a supportive friend; name one feeling you’ve had today."
    ].map(s => `💡 ${s}`).join('<br>');
    diet = [
      "Regular meals with protein + complex carbs (oats, lentils, quinoa).",
      "Magnesium sources (pumpkin seeds, spinach) may support relaxation.",
      "Limit excess caffeine; swap a coffee for green tea."
    ].map(s => `🍵 ${s}`).join('<br>');
  } else {
    result = "It seems you're struggling — you’re not alone, support can help.";
    suggestions = [
      "Reach out to a counselor, helpline, or someone you trust.",
      "Write down 3 emotions and what might be driving them.",
      "Try a guided 3–5 minute breathing session to ground."
    ].map(s => `🧠 ${s}`).join('<br>');
    diet = [
      "Warm, simple meals: soups, stews, whole‑grain toast with eggs.",
      "B‑vitamins and iron (beans, eggs, spinach).",
      "If appetite is low, try small nutrient‑dense snacks every 3–4 hours."
    ].map(s => `🍲 ${s}`).join('<br>');
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


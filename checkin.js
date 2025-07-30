// Updated JavaScript for Mental Health Check-In with suggestions based on score only (no answer summary)

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
let answers = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("emoji-options");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");

function loadQuestion(index) {
  const current = questions[index];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";
  nextBtn.disabled = true;

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    btn.onclick = () => selectOption(option, btn);
    optionsEl.appendChild(btn);
  });

  progressFill.style.width = `${(index / questions.length) * 100}%`;
}

function selectOption(option, btn) {
  document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  answers[currentIndex] = option;
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion(currentIndex);
  } else {
    showFinalFeedback();
  }
});

function calculateMentalHealthStatus() {
  let score = 0;

  answers.forEach(answer => {
    switch (answer) {
      case "Great":
      case "Very Well":
      case "Yes, absolutely":
      case "Rarely":
      case "Very motivated":
      case "Yes":
        score += 3;
        break;
      case "Okay":
      case "Somewhat":
      case "Sometimes":
      case "Occasionally":
        score += 2;
        break;
      case "Stressed":
      case "Poorly":
      case "Not really":
      case "Often":
      case "Not much":
        score += 1;
        break;
      case "Anxious":
      case "Didn't sleep":
      case "I feel alone":
      case "Always":
      case "Not at all":
      case "Never":
        score += 0;
        break;
    }
  });

  let result = "";
  let suggestions = "";

  if (score >= 15) {
    result = "You're doing well overall. Keep maintaining your self-care routines!";
    suggestions = `
      ✅ Continue mindfulness or journaling.<br>
      ✅ Stay socially connected.<br>
      ✅ Celebrate small victories and stay active.
    `;
  } else if (score >= 9) {
    result = "You're feeling a little stressed. Try to rest and reach out if needed.";
    suggestions = `
      💡 Take short breaks and breathe deeply.<br>
      💡 Talk to a friend or loved one.<br>
      💡 Engage in a hobby you enjoy today.
    `;
  } else {
    result = "You may be struggling. Please reach out to someone or a professional.";
    suggestions = `
      🧠 Talk to a counselor or therapist.<br>
      🧠 Use helplines or support services if needed.<br>
      🧠 Be kind to yourself, you're not alone.
    `;
  }

  return { result, suggestions };
}

function showFinalFeedback() {
  questionEl.textContent = "Thank you for checking in!";
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
  progressFill.style.width = "100%";

  const { result, suggestions } = calculateMentalHealthStatus();

  const finalResult = document.createElement("div");
  finalResult.classList.add("final-result");
  finalResult.innerHTML = `
    <h3>Your Mental Health Status:</h3>
    <p>${result}</p>
    <div class="suggestions">
      <h4>Suggestions for You:</h4>
      <p>${suggestions}</p>
    </div>
  `;

  optionsEl.appendChild(finalResult);
}

// Start
loadQuestion(currentIndex);

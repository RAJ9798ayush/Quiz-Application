document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.querySelector(".start-btn");
  const instructionCard = document.querySelector(".instruction");
  const instructionExit = document.querySelectorAll(".instruction button")[0];
  const startQuizBtn = document.querySelectorAll(".instruction button")[1];
  const wrapper = document.querySelector(".wrapper");
  const nxtBtn = document.querySelector(".btn button");
  const resultCard = document.querySelector(".result-card");
  const time = document.querySelectorAll(".Timer p")[1];
  const progressBar = document.querySelector(".inner");
  const questionEl = document.querySelector(".question-container");
  const answerContainer = document.querySelector(".option-container");
  const currentQuestionNum = document.querySelector(".current-question");
  const totalQuestion = document.querySelector(".total-question");
  const totalScore = document.querySelector(".total-score .value");
  const yourScore = document.querySelector(".user-score .value");
  const unattempted = document.querySelector(".unattempted .value");
  const attempted = document.querySelector(".attempted .value");
  const wrong = document.querySelector(".wrong .value");
  const replayQuiz = document.querySelectorAll(".score-btn button")[0];
  const exitQuiz = document.querySelectorAll(".score-btn button")[1];
  const loginPage = document.querySelector(".login-page");
  const thankYouPage = document.querySelector(".thank-you-page");
  const loginBtn = document.getElementById("loginBtn");
  const returnHomeBtn = document.getElementById("returnHome");
  const categorySelect = document.querySelector(".category-select");
  const categoryBtns = document.querySelectorAll(".category-select button");
  const userDisplay = document.getElementById("userDisplay");
  const categoryDisplay = document.getElementById("categoryDisplay");

  let currentQuestion = 0;
  let timer, score = 0, attemptQuestion = 0, unattemptedQuestion = 0, wrongQuestion = 0;
  let username = "";
  let category = "";
  let filteredQuestions = [];

  const questions = {
    java: [
      { question: "Which of the following is not a feature of Java?", options: ["Platform independence", "Object-oriented", "Pointer support", "Robust"], answer: 2 },
      { question: "What is the size of an int data type in Java?", options: ["2 bytes", "4 bytes", "8 bytes", "Depends on the system"], answer: 1 },
      { question: "Which keyword is used to inherit a class in Java?", options: ["implement", "inherit", "extends", "superclass"], answer: 2 },
      { question: "What is the correct way to start a thread in Java?", options: ["run()", "execute()", "start()", "init()"], answer: 2 }
    ],
    network: [
      { question: "Which layer of the OSI model is responsible for end-to-end communication?", options: ["Transport", "Network", "Data Link", "Session"], answer: 0 },
      { question: "What is the function of DNS in a network?", options: ["Translates IP to MAC", "Translates domain names to IP addresses", "Provides routing paths", "Encrypts communication"], answer: 1 },
      { question: "Which of the following is a Class C IP address?", options: ["192.168.1.1", "10.0.0.1", "172.16.0.1", "224.0.0.1"], answer: 0 },
      { question: "What is the port number of HTTP?", options: ["21", "23", "80", "110"], answer: 2 }
    ],
    python: [
      { question: "Which of the following is used to define a block of code in Python?", options: ["Brackets {}", "Parentheses ()", "Indentation", "Quotes \"\"\""], answer: 2 },
      { question: "What will be the output of print(2**3) in Python?", options: ["6", "8", "9", "5"], answer: 1 },
      { question: "Which of the following is used to define a function in Python?", options: ["func", "define", "def", "function"], answer: 2 }
    ],
    general: [
      { question: "What is the smallest planet in our solar system?", options: ["Mars", "Venus", "Mercury", "Jupiter"], answer: 2 },
      { question: "Who painted the famous artwork 'The Starry Night'?", options: ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"], answer: 1 },
      { question: "What is the capital city of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
      { question: "Who wrote the Harry Potter book series?", options: ["J.K. Rowling", "George R.R. Martin", "Stephen King", "Dan Brown"], answer: 0 }
    ]
  };

  loginBtn.addEventListener("click", () => {
    const name = document.getElementById("username").value.trim();
    if (name !== "") {
      username = name;
      loginPage.classList.add("hide");
      categorySelect.classList.remove("hide");
    }
  });

  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      category = btn.dataset.category;
      filteredQuestions = questions[category];
      categorySelect.classList.add("hide");
      startBtn.classList.remove("hide");
    });
  });

  returnHomeBtn.addEventListener("click", () => {
    thankYouPage.classList.add("hide");
    loginPage.classList.remove("hide");
    document.getElementById("username").value = "";
  });

  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hide");
    instructionCard.classList.remove("hide");
  });

  instructionExit.addEventListener("click", () => {
    instructionCard.classList.add("hide");
    startBtn.classList.remove("hide");
  });

  startQuizBtn.addEventListener("click", () => {
    instructionCard.classList.add("hide");
    wrapper.classList.remove("hide");
    totalQuestion.textContent = filteredQuestions.length;
    startQuiz();
  });

  replayQuiz.addEventListener("click", () => {
    resultCard.classList.add("hide");
    wrapper.classList.remove("hide");
    resetQuiz();
    startQuiz();
  });

  exitQuiz.addEventListener("click", () => {
    resultCard.classList.add("hide");
    thankYouPage.classList.remove("hide");
    userDisplay.textContent = username;
    categoryDisplay.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  });

  nxtBtn.addEventListener("click", nextQuestion);

  function startQuiz() {
    currentQuestion = 0;
    score = 0;
    attemptQuestion = 0;
    unattemptedQuestion = 0;
    wrongQuestion = 0;
    time.textContent = "15";
    currentQuestionNum.textContent = currentQuestion + 1;
    displayQuestion(currentQuestion);
    timer = setInterval(updateTimer, 1000);
    updateProgress();
  }

  function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    attemptQuestion = 0;
    unattemptedQuestion = 0;
    wrongQuestion = 0;
    currentQuestionNum.textContent = 1;
    time.textContent = "15";
    answerContainer.innerHTML = "";
  }

  function displayQuestion(index) {
    answerContainer.innerHTML = "";
    const q = filteredQuestions[index];
    questionEl.textContent = q.question;
    q.options.forEach((opt, i) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(i);
      answerContainer.appendChild(btn);
    });
  }

  function checkAnswer(selectedIndex) {
    clearInterval(timer);
    attemptQuestion++;
    answerContainer.style.pointerEvents = "none";
    const correctIndex = filteredQuestions[currentQuestion].answer;
    const options = document.querySelectorAll(".option");

    if (selectedIndex === correctIndex) {
      score++;
      options[selectedIndex].classList.add("correct");
    } else {
      wrongQuestion++;
      options[selectedIndex].classList.add("wrong");
      options[correctIndex].classList.add("correct");
    }
  }

  function nextQuestion() {
    answerContainer.style.pointerEvents = "auto";
    clearInterval(timer);
    time.textContent = "15";

    if (currentQuestion === filteredQuestions.length - 1) {
      showResults();
    } else {
      currentQuestion++;
      currentQuestionNum.textContent = currentQuestion + 1;
      displayQuestion(currentQuestion);
      timer = setInterval(updateTimer, 1000);
      updateProgress();
    }
  }

  function updateTimer() {
    let timeLeft = parseInt(time.textContent);
    if (timeLeft <= 1) {
      clearInterval(timer);
      unattemptedQuestion++;
      showCorrectAnswer();
    } else {
      time.textContent = timeLeft - 1;
    }
  }

  function showCorrectAnswer() {
    const correctIndex = filteredQuestions[currentQuestion].answer;
    const options = document.querySelectorAll(".option");
    options[correctIndex].classList.add("correct");
    answerContainer.style.pointerEvents = "none";
  }

  function updateProgress() {
    const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function showResults() {
    wrapper.classList.add("hide");
    resultCard.classList.remove("hide");
    totalScore.textContent = filteredQuestions.length;
    yourScore.textContent = score;
    attempted.textContent = attemptQuestion;
    unattempted.textContent = filteredQuestions.length - attemptQuestion;
    wrong.textContent = wrongQuestion;
  }
});

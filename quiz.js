const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value, time) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

let questions = [],
  time = 30,
  score = 0,
  currentQuestion = 1,
  timer;

const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value;
  loadingAnimation();
  fetch("fragen.json")
    .then((res) => res.json())
    .then((data) => {
      questions = data.Kategorien[cat];
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        showQuestion(questions[0]);
        startTimer(timePerQuestion.value);
      }, 1000);
    });
};

startBtn.addEventListener("click", startQuiz);

const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAudio("countdown.mp3");
    }
    if (time >= 0) {
      progress(time, timePerQuestion.value);
      time--;
    } else {
      checkAnswer();
      clearInterval(timer);
    }
  }, 1000);
};

const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper"),
    questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <i class="fas fa-check"></i>
        </span>
      </div>`;
  });

  questionNumber.innerHTML = ` Question <span class="current">${currentQuestion}</span>
            <span class="total">/${questions.length}</span>`;

  //add event listener to each answer
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });
};

const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");
submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
      playAudio("correct.mp3");
    } else {
      selectedAnswer.classList.add("wrong");
      const correctAnswer = document.querySelector(
        `.answer .text:contains(${questions[currentQuestion - 1].correct_answer})`
      );
      correctAnswer.parentElement.classList.add("correct");
      playAudio("wrong.mp3");
    }
  } else {
    const correctAnswer = document.querySelector(
      `.answer .text:contains(${questions[currentQuestion - 1].correct_answer})`
    );
    correctAnswer.parentElement.classList.add("correct");
    playAudio("correct.mp3");
  }
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
    startTimer(timePerQuestion.value);
  } else {
    quiz.classList.add("hide");
    setTimeout(() => {
      resultScreen();
    }, 1000);
  }
};

const resultScreen = () => {
  const scoreText = document.querySelector(".score"),
    result = document.querySelector(".result");
  scoreText.innerHTML = `Score: ${score}`;
  result.classList.remove("hide");
  progressBar.style.width = "100%";
  progressText.innerHTML = `Score: ${score}`;
};

const playAudio = (file) => {
  const audio = new Audio(`./assets/${file}`);
  audio.play();
};

const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};

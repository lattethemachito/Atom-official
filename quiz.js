// Der folgende Code befasst sich mit der Funktionalität eines Quiz-Systems.

// Selektiere die HTML-Elemente, die für die Fortschrittsanzeige des Quiz benötigt werden
const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

// Definiere eine Funktion, die den Fortschritt des Quiz anhand des aktuellen Wertes aktualisiert
const progress = (value) => {
  const percentage = (value / time) * 100; // Berechne den Prozentsatz des Fortschritts
  progressBar.style.width = `${percentage}%`; // Setze die Breite der Fortschrittsleiste entsprechend des Prozentsatzes
  progressText.innerHTML = `${value}`; // Zeige den aktuellen Wert des Fortschritts an
};

// Selektiere die Start-Schaltfläche und andere Einstellungen des Quiz
const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

// Initialisiere Variablen für Fragen, Zeit, Punktzahl usw.
let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

// Funktion zum Starten des Quiz
const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value;
  loadingAnimation(); // Starte eine Ladeanimation
  fetch("fragen.json") // Lade Fragen aus einer JSON-Datei
    .then((res) => res.json()) // Konvertiere die Antwort in JSON
    .then((data) => {
      questions = data.Kategorien[cat]; // Wähle Fragen basierend auf der ausgewählten Kategorie aus
      questions = questions.slice(0, num); // Begrenze die Anzahl der Fragen basierend auf der ausgewählten Anzahl
      setTimeout(() => {
        startScreen.classList.add("hide"); // Verstecke den Startbildschirm
        quiz.classList.remove("hide"); // Zeige den Quizbildschirm
        currentQuestion = 1; // Setze die aktuelle Frage auf die erste Frage
        showQuestion(questions[0]); // Zeige die erste Frage
      }, 1000); // Nach 1 Sekunde
    });
};

// Füge einen Event-Listener zur Start-Schaltfläche hinzu, um das Quiz zu starten
startBtn.addEventListener("click", startQuiz);

// Funktion zum Anzeigen einer Frage
const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");
  questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question; // Zeige den Text der aktuellen Frage an

  // Wähle zufällig Antworten aus und zeige sie an
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
      <div class="answer ">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <i class="fas fa-check"></i>
        </span>
      </div>
    `;
  });

  // Zeige die Frage-Nummer an
  questionNumber.innerHTML = ` Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
            <span class="total">/${questions.length}</span>`;

  // Füge jedem Antwort-Element einen Event-Listener hinzu, um die Auswahl zu ermöglichen
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false; // Aktiviere die Einreichungs-Schaltfläche, wenn eine Antwort ausgewählt wurde
      }
    });
  });

  time = timePerQuestion.value; // Setze die Zeit für die aktuelle Frage
  startTimer(time); // Starte den Timer für die Frage
};

// Funktion zum Starten des Timers
const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAdudio("countdown.mp3"); // Spiele ein Audio ab, wenn die Zeit knapp wird
    }
    if (time >= 0) {
      progress(time); // Aktualisiere den Fortschritt
      time--;
    } else {
      checkAnswer(); // Überprüfe die Antwort, wenn die Zeit abgelaufen ist
    }
  }, 1000); // Alle 1 Sekunde
};

// Funktion zur Anzeige einer Ladeanimation
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

// Definiere eine Funktion
function defineProperty() {
  var osccred = document.createElement("div");
}
defineProperty(); // Aufruf der oben definierten Funktion

// Selektiere die Schaltflächen für die Einreichung und den Wechsel zur nächsten Frage
const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

// Füge Event-Listener hinzu, um die Einreichung und den Wechsel zur nächsten Frage zu steuern
submitBtn.addEventListener("click", () => {
  checkAnswer(); // Überprüfe die Antwort
});

nextBtn.addEventListener("click", () => {
  nextQuestion(); // Gehe zur nächsten Frage
  submitBtn.style.display = "block"; // Zeige die Einreichungsschaltfläche
  nextBtn.style.display = "none"; // Verstecke die Schaltfläche zum Wechseln zur nächsten Frage
});

// Funktion zur Überprüfung der Antwort
const checkAnswer = () => {
  clearInterval(timer); // Stoppe den Timer
  const selectedAnswer = document.querySelector(".answer.selected"); // Selektiere die ausgewählte Antwort
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++; // Inkrementiere die Punktzahl, wenn die Antwort korrekt ist
      selectedAnswer.classList.add("correct"); // Füge die Klasse "correct" hinzu, um die korrekte Antwort anzuzeigen
    } else {
      selectedAnswer.classList.add("wrong"); // Füge die Klasse "wrong" hinzu, um eine falsche Antwort anzuzeigen
      const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
          if (
            answer.querySelector(".text").innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add("correct"); // Markiere die korrekte Antwort
          }
        });
    }
  } else {
    const correctAnswer = document
      .querySelectorAll(".answer")
      .forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add("correct"); // Markiere die korrekte Antwort, wenn keine ausgewählt wurde
        }
      });
  }
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.classList.add("checked"); // Füge die Klasse "checked" hinzu, um anzuzeigen, dass die Antwort überprüft wurde
  });

  submitBtn.style.display = "none"; // Verstecke die Einreichungsschaltfläche
  nextBtn.style.display = "block"; // Zeige die Schaltfläche zum Wechseln zur nächsten Frage
};

// Funktion zum Wechseln zur nächsten Frage
const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++; // Inkrementiere die aktuelle Frage
    showQuestion(questions[currentQuestion - 1]); // Zeige die nächste Frage an
  } else {
    showScore(); // Wenn alle Fragen beantwortet wurden, zeige die Punktzahl an
  }
};

// Selektiere die Endbildschirm-Elemente
const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

// Funktion zur Anzeige der Punktzahl
const showScore = () => {
  endScreen.classList.remove("hide"); // Verstecke den Quiz-Bildschirm
  quiz.classList.add("hide"); // Zeige den Endbildschirm an
  finalScore.innerHTML = score; // Zeige die erreichte Punktzahl an
  totalScore.innerHTML = `/ ${questions.length}`; // Zeige die Gesamtzahl der Fragen an
};

// Selektiere die Neustart-Schaltfläche und füge einen Event-Listener hinzu, um das Quiz neu zu starten
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload(); // Lade die Seite neu, um das Quiz neu zu starten
});

// Funktion zum Abspielen eines Audios
const playAdudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};

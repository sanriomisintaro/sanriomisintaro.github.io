const questions = [
    { text: "go - went - gone", answer: true },
    { text: "swim - swam - swimmed", answer: false },
    { text: "eat - ate - eaten", answer: true },
    { text: "drive - drived - driven", answer: false },
    { text: "run - ran - run", answer: true },
];

let currentQuestion = {};
let score = 0;

function loadQuestion() {
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById("question").innerText = currentQuestion.text;
}

function checkAnswer(userAnswer) {
    if (userAnswer === currentQuestion.answer) {
        alert("✅ Correct!");
        score++;
    } else {
        alert("❌ Incorrect.");
    }
    document.getElementById("score").innerText = "Score: " + score;
    loadQuestion();
}

loadQuestion();

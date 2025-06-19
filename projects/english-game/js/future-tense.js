const questions = [
    { text: "She will call you tomorrow.", answer: true },
    { text: "We will go to the party next weekend.", answer: true },
    { text: "He will helps me later.", answer: false },
    { text: "They will arrive at 8 o'clock.", answer: true },
    { text: "I will finish my homework soon.", answer: true },
    { text: "She will buying a new phone next month.", answer: false },
    { text: "We will meet them after lunch.", answer: true },
    { text: "He will goes to the gym tomorrow.", answer: false },
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

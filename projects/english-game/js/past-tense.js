const questions = [
    { text: "He visited his grandma last week.", answer: true },
    { text: "They watch a movie yesterday.", answer: false },
    { text: "I cooked dinner for my family.", answer: true },
    { text: "She buyed a new dress.", answer: false },
    { text: "We walked to the park this morning.", answer: true },
    { text: "They goes to the beach last Sunday.", answer: false },
    { text: "I painted the wall last night.", answer: true },
    { text: "He do his homework yesterday.", answer: false },
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

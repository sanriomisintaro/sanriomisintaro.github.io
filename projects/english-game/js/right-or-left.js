const questions = [
    { left: "She go to school every day.", right: "She goes to school every day.", answer: "right" },
    { left: "They doesn't like pizza.", right: "They don't like pizza.", answer: "right" },
    { left: "I am happy today.", right: "I are happy today.", answer: "left" },
    { left: "He do his homework.", right: "He does his homework.", answer: "right" },
    { left: "We was at the party.", right: "We were at the party.", answer: "right" },
    { left: "You is very kind.", right: "You are very kind.", answer: "right" },
];

let currentQuestion = {};
let score = 0;

function loadQuestion() {
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById("left-sentence").innerText = currentQuestion.left;
    document.getElementById("right-sentence").innerText = currentQuestion.right;
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

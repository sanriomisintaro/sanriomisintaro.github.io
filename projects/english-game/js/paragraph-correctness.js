const questions = [
    { 
        text: "I goes to the market every Sunday. I like to buy fresh fruits and vegetables. After shopping, I take a bus to my home.", 
        answer: false 
    },
    { 
        text: "She is a very good teacher. She explains the lessons clearly and helps the students when they need it.", 
        answer: true 
    },
    { 
        text: "Yesterday, we visit our grandparents. They was very happy to see us.", 
        answer: false 
    },
    { 
        text: "I have always loved reading books. It helps me relax and learn new things.", 
        answer: true 
    },
    { 
        text: "He don't like to play football, but he loves to watch it on TV.", 
        answer: false 
    },
];

let currentQuestion = {};
let score = 0;

function loadQuestion() {
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById("paragraph").innerText = currentQuestion.text;
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

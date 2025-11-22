const problem = document.getElementById('problem');

const feedback = document.getElementById('feedback');
const correctScore = document.getElementById('correct-score-value');
const wrongScore = document.getElementById('wrong-score-value');

const currentAnswerDisplay = document.getElementById('current-answer');
const minus10Btn = document.getElementById('minus-10');
const minus1Btn = document.getElementById('minus-1');
const plus1Btn = document.getElementById('plus-1');
const plus10Btn = document.getElementById('plus-10');
const checkAnswerBtn = document.getElementById('check-answer');

const emojiMap = [
    "🍉", "🍊", "🍏", "🥝", "🍅", "🍕", "⚽", "🥎", "🏀", "🏓",
    "⛺", "🎤", "🎺", "🦖", "🐸", "🐲", "🐬", "🐧", "🐹", "🦉",
    "🐵", "🌸", "🐟", "🦆", "🦫", "🐶", "🐺", "🦝", "🐈", "🐯", "🐴"
];

let correctScoreValue = 0;
let wrongScoreValue = 0;
let correctAnswer;
let difficulty = 2;
let currentAnswerInput = 0;

function updateAnswerDisplay() {
    currentAnswerDisplay.textContent = currentAnswerInput;
}

function generateProblem() {
    const emoji = emojiMap[Math.floor(Math.random() * emojiMap.length)];
    problem.innerHTML = '';
    feedback.textContent = '';
    correctAnswer = 0;
    currentAnswerInput = 0;
    updateAnswerDisplay();
    difficulty = parseInt(document.getElementById('difficulty-level').value);

    for (let i = 0; i < difficulty; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');

        const num = Math.floor(Math.random() * 10) + 1;
        correctAnswer += num;

        let emojis = document.createElement('span');
        emojis.classList.add('emoji');
        emojis.textContent = emoji.repeat(num);
        let number = document.createElement('span');
        number.textContent = num;
        tile.appendChild(emojis);
        tile.appendChild(number);

        problem.appendChild(tile);
        if (i < difficulty - 1) {
            let plusSign = document.createElement('span');
            plusSign.textContent = "+";
            problem.appendChild(plusSign);
        }
    }
}

function updateScoreUI() {
    correctScore.textContent = correctScoreValue;
    wrongScore.textContent = wrongScoreValue;
}

minus10Btn.addEventListener('click', () => {
    currentAnswerInput = Math.max(0, currentAnswerInput - 10);
    updateAnswerDisplay();
});
minus1Btn.addEventListener('click', () => {
    currentAnswerInput = Math.max(0, currentAnswerInput - 1);
    updateAnswerDisplay();
});
plus1Btn.addEventListener('click', () => {
    currentAnswerInput += 1;
    updateAnswerDisplay();
});
plus10Btn.addEventListener('click', () => {
    currentAnswerInput += 10;
    updateAnswerDisplay();
});

checkAnswerBtn.addEventListener('click', () => {
    if (currentAnswerInput === correctAnswer) {
        feedback.textContent = "Correct!";
        correctScoreValue++;
        currentAnswerDisplay.classList.add('correct-answer-glow');
    } else {
        feedback.textContent = `Oops! The correct answer is ${correctAnswer}.`;
        wrongScoreValue++;
    }
    updateScoreUI();
    setTimeout(() => {
        currentAnswerDisplay.classList.remove('correct-answer-glow');
        generateProblem();
    }, 2000);
});

document.getElementById('difficulty-level').addEventListener('change', generateProblem);

generateProblem();

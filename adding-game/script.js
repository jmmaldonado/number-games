const problem = document.getElementById('problem');

const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');
const option3 = document.getElementById('option3');
const feedback = document.getElementById('feedback');
const correctScore = document.getElementById('correct-score-value');
const wrongScore = document.getElementById('wrong-score-value');
const nextQuestionBtn = document.getElementById('next-question');

const emojiMap = [
    "🍉", "🍊", "🍏", "🥝", "🍅", "🍕", "⚽", "🥎", "🏀", "🏓",
    "⛺", "🎤", "🎺", "🦖", "🐸", "🐲", "🐬", "🐧", "🐹", "🦉",
    "🐵", "🌸", "🐟", "🦆", "🦫", "🐶", "🐺", "🦝", "🐈", "🐯", "🐴"
]


let correctScoreValue = 0;
let wrongScoreValue = 0;

let correctAnswer;
let difficulty = 2
let enabledButtons = true

function generateProblem() {
    const emoji = emojiMap[Math.floor(Math.random() * emojiMap.length)]
    problem.innerHTML = '';
    feedback.textContent = '';
    correctAnswer = 0
    restoreButtons()
    difficulty = parseInt(document.getElementById('difficulty-level').value);


    for (let i = 0; i < difficulty; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile')

        const num = Math.floor(Math.random() * 10) + 1;
        correctAnswer += num;

        let emojis = document.createElement('span')
        emojis.classList.add('emoji')
        emojis.textContent = emoji.repeat(num)
        let number = document.createElement('span')
        number.textContent = num
        tile.appendChild(emojis)
        tile.appendChild(number)

        problem.appendChild(tile)
        if (i < difficulty - 1) {
            let plusSign = document.createElement('span')
            plusSign.textContent = "+"
            problem.appendChild(plusSign)
        }
    }

    const wrongAnswers = [];

    wrongAnswers.push(correctAnswer + 1);
    wrongAnswers.push(correctAnswer);
    wrongAnswers.push(correctAnswer - 1);
    wrongAnswers.sort(() => Math.random() - 0.5);

    option1.textContent = wrongAnswers[0];
    option2.textContent = wrongAnswers[1];
    option3.textContent = wrongAnswers[2];
}

function checkAnswer(chosenOption) {
    if (parseInt(chosenOption) === correctAnswer) {
        feedback.textContent = "Correct!";
        correctScoreValue++;
        sayCorrect()
        return true
    } else {
        feedback.textContent = `Oops! The correct answer is ${correctAnswer}.`;
        wrongScoreValue++;
        return false
    }

}

function handleAnswerClick(event, answer) {
    let phrase = ""
    if (enabledButtons) {
        enabledButtons = false

        if (parseInt(answer) === correctAnswer) {
            feedback.textContent = "Correct!";
            correctScoreValue++;

            document.querySelectorAll("#answers button").forEach((el) => { if (el != event.srcElement) el.style.opacity = 0 })
            event.srcElement.classList.remove('button-84')
            event.srcElement.classList.add('button-85')

            phrase = "Correct"
            
        } else {
            phrase = `Oops! The correct answer is ${correctAnswer}.`;
            feedback.textContent = phrase
            wrongScoreValue++;
        }

        speak(phrase)
        updateScoreUI()
    }
}

function speak(phrase) {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.pitch = 1
    utterance.lang = "en-EN";
    speechSynthesis.speak(utterance);
    setTimeout(generateProblem, 5000)
}


function restoreButtons() {
    enabledButtons = true
    document.querySelectorAll("#answers button").forEach((el) => {
        el.style.opacity = 100;
        el.classList = ['button-84']

    })
}

function updateScoreUI() {
    correctScore.textContent = correctScoreValue
    wrongScore.textContent = wrongScoreValue
}

option1.addEventListener('click', (event) => handleAnswerClick(event, option1.textContent));
option2.addEventListener('click', (event) => handleAnswerClick(event, option2.textContent));
option3.addEventListener('click', (event) => handleAnswerClick(event, option3.textContent));
document.getElementById('difficulty-level').addEventListener('change', generateProblem)

generateProblem()
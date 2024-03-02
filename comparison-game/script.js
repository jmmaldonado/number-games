const number1 = document.getElementById('number1');
const number2 = document.getElementById('number2');
const answerButton = document.getElementById('buttonAnswer');
const operationImage = document.getElementById('operationImg');
const correctScore = document.getElementById('correct-score-value');
const wrongScore = document.getElementById('wrong-score-value');

let correctScoreValue = 0;
let wrongScoreValue = 0;
let enabledButtons = true
let num1 = 0
let num2 = 0

function generateNumbers() {
  num1 = Math.floor(Math.random() * 1000); // Generate random numbers between 0 and 99
  num2 = Math.floor(Math.random() * 1000);
  number1.textContent = num1;
  number2.textContent = num2;
  number1.style.color = colorFromHash(hashCode(num1.toString()));
  number2.style.color = colorFromHash(hashCode(num2.toString()));
  answerButton.classList.add('button-84') 
  answerButton.classList.remove('button-85') 
  enabledButtons = true
}

generateNumbers();


function handleAnswerClick() {
    let phrase = ""
    if (enabledButtons) {
        enabledButtons = false


        if (operationImage.dataset.operation === "greaterThan") {
            if (num1 >= num2) {
                correctScoreValue++;
                answerButton.classList.add('button-85')    
                answerButton.classList.remove('button-84') 

                phrase = "Correct"
            } else {
                phrase = `Oops! The bigger number is ${num2}.`;
                wrongScoreValue++;
            }
        } 

        if (operationImage.dataset.operation === "lessThan") {
            if (num2 >= num1) {
                correctScoreValue++;
                answerButton.classList.add('button-85')   
                answerButton.classList.remove('button-84') 
 
                phrase = "Correct"
            } else {
                phrase = `Oops! The bigger number is ${num1}.`;
                wrongScoreValue++;
            }
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
    setTimeout(generateNumbers, 3000)
}

function updateScoreUI() {
    correctScore.textContent = correctScoreValue
    wrongScore.textContent = wrongScoreValue
}


function changeOperationSide() {
    if (operationImage.dataset.operation === "greaterThan") {
        operationImage.src = "lessThan.png"
        operationImage.dataset.operation = "lessThan"
    } else {
        operationImage.src = "greaterThan.png"
        operationImage.dataset.operation = "greaterThan"
    }
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (str.charCodeAt(i) * 31) ^ hash;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash); // Keep result positive 
}

function colorFromHash(hash) {
    const angle = hash % 360;
    return `hsl(${angle}, 80%, 60%)`; // Use HSL color for vibrant variation
}


function changeCounterColor() {
    const color = colorFromHash(hashCode(count.toString()));
    counterDisplay.style.color = color;
}

operationImage.addEventListener('click', changeOperationSide)

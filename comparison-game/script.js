const instruction = document.getElementById('instruction');
const number1 = document.getElementById('number1');
const number2 = document.getElementById('number2');

function generateNumbers() {
  const num1 = Math.floor(Math.random() * 100); // Generate random numbers between 0 and 99
  const num2 = Math.floor(Math.random() * 100);
  number1.textContent = num1;
  number2.textContent = num2;
  instruction.textContent = (num1 > num2) ? "Smaller" : "Bigger"; // Set instruction based on generated numbers
}

generateNumbers();

number1.addEventListener('click', function() {
  if (instruction.textContent === "Smaller" && Number(number1.textContent) < Number(number2.textContent)) {
    // Correct answer
    number1.classList.add('correct');
  } else {
    // Wrong answer
    number1.classList.add('wrong');
    number2.classList.add('correct');
  }
});

number2.addEventListener('click', function() {
  if (instruction.textContent === "Bigger" && Number(number2.textContent) > Number(number1.textContent)) {
    // Correct answer
    number2.classList.add('correct');
  } else {
    // Wrong answer
    number2.classList.add('wrong');
    number1.classList.add('correct');
  }
  generateNumbers(); // Generate new numbers after each answer
});

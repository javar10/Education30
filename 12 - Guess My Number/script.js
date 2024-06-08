const pressedKeysArray = [];
const secretCode = Math.floor(Math.random() * 100);
const alertMessage = 'Enter a number between 0 and 99';
let numGuesses = 0;

// Get the guess as a number.
function getGuess() {
    const guess = pressedKeysArray.splice(0, pressedKeysArray.length - 1).join('');
    return Number(guess);
}

// Move the estimation bar.
const estimationBar = document.querySelector('.estimation');
let low = 0;
let high = 100;
function moveBar(guess) {
    if (guess < secretCode && guess > low) {
        low = guess;
    } else if (guess > secretCode && guess < high) {
        high = guess;
    }
    estimationBar.style.left = `${low / 100 * 90 + 5}vw`;
    estimationBar.style.width = `${(high - low) / 100 * 90}vw`;
    estimationBar.style.display = 'block';
}

// Compare guess to secret code.
function calcHighOrLow(guess) {
    const h3 = document.querySelector('h3');
    if (guess > secretCode) {
        h3.textContent = `${guess} is too high!`;
        newTick(guess);
        numGuesses++;
    } else if (guess < secretCode) {
        h3.textContent = `${guess} is too low!`;
        newTick(guess);
        numGuesses++;
    } else if (guess == secretCode) {
        numGuesses++;
        document.querySelector('body').innerHTML = `
        <div class="correct">
        <h1>You guessed the secret number
        <br><span>${secretCode}</span>
        <br>in ${numGuesses} guesses.
        </h1>
        <button id="restart">Play Again</button>
        </div>
        `
        const restart = document.querySelector('#restart');
        restart.addEventListener('click', () => location.reload());
    } else {
        alert(alertMessage);
        console.log('high low else code ran');
    }
}

// Display a tick for each guess.
function newTick(guess) {
    const newTick = document.createElement('div');
    const timeline = document.querySelector('.timeline');
    newTick.innerHTML = `<p>${guess}</p>`;
    newTick.classList.add('tick');
    newTick.style.left = `${guess / 100 * 90 + 5}vw`;
    timeline.appendChild(newTick);
}

// Reset array.
function resetGuess() {
    pressedKeysArray.splice(0, 3);
    keyCount = 0;
}

// Listen for keypress event and store keys in an array.
let keyCount = 0;
window.addEventListener("keyup", (e) => {
    if (!isNaN(parseInt(e.key))) {
        pressedKeysArray.push(e.key);
        keyCount += 1;
    } else if (keyCount != 0 && e.key === 'Enter') {
        pressedKeysArray.push(e.key);
        const guess = getGuess();
        moveBar(guess);
        calcHighOrLow(guess);
        resetGuess();
    } else {
        resetGuess();
        alert(alertMessage);
    }

    if (keyCount > 2 && e.key != 'Enter') {
        resetGuess();
        alert(alertMessage);
    }
});

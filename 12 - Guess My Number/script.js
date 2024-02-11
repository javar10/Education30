const pressed = [];
const secretCode = Math.floor(Math.random() * 100);
const alertMessage = 'Enter a number between 0 and 99';
let numGuesses = 0;


// function to check the number
function getGuess() {
    let guess;
    if (pressed[0] === 'Enter') {
        alert(alertMessage);
    } else if (pressed[2] === 'Enter') {
        guess = pressed.splice(0, 2).join('');
        moveBar(guess);
    } else if (pressed[1] === 'Enter') {
        guess = pressed.splice(0, 1).join('');
        moveBar(guess);
    }
    highOrLow(guess);
}

// function to say higher or lower
function highOrLow(guess) {
    const h3 = document.querySelector('h3');
    if (Number(guess) > Number(secretCode)) {
        h3.textContent = `${guess} is too high!`;
        newTick(guess);
        numGuesses ++;
    } else if (Number(guess) < Number(secretCode)) {
        h3.textContent = `${guess} is too low!`;
        newTick(guess);
        numGuesses ++;
    } else if (Number(guess) == Number(secretCode)) {
        numGuesses ++;
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
    }
}

// function to move the estimation bar
const estimationBar = document.querySelector('.estimation');
let low = 0;
let high = 100;
function moveBar(guess) {
    if (Number(guess) < Number(secretCode) && Number(guess) > low) {
        low = Number(guess);
    } else if (Number(guess) > Number(secretCode) && Number(guess) < high) {
        high = Number(guess);
    }
    estimationBar.style.left = `${low/100*90+5}vw`;
    estimationBar.style.width = `${(high-low)/100*90}vw`;
    estimationBar.style.display = 'block';
}

// display ticks for each guess
function newTick(guess) {
    const newTick = document.createElement('div');
    const timeline = document.querySelector('.timeline');
    newTick.innerHTML = `<p>${guess}</p>`;
    newTick.classList.add('tick');
    newTick.style.left = `${guess/100*90+5}vw`;
    timeline.appendChild(newTick);
}

// storing pressed keys in an array
let keyCount = 0;
window.addEventListener("keyup", (e) => {
    if (!isNaN(e.key)) {
        pressed.push(e.key);
        keyCount += 1;
    } else if (e.key === 'Enter') {
        if (pressed.length != 0) {
            pressed.push(e.key);
        }
        getGuess();
        pressed.splice(0,3);
        keyCount = 0;
    } else {
        alert(alertMessage);
        keyCount = 0;
    }
    if (keyCount > 2 && e.key != 'Enter') {
        pressed.splice(0,3);
        alert(alertMessage);
        keyCount = 0;
    }

    if (pressed.length > 3) {
        pressed.splice(0, 1);
    }
});



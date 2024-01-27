
// Set canvas
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = '#BADA55';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 15;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function draw(e) {
    if (!isDrawing) return; // stop the fn from running when they are not moused down
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();

    // start from
    ctx.moveTo(lastX, lastY);
    // go to
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];

    hue++;
    if (hue >= 360) {
        hue = 0;
    }
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('touchend', () => isDrawing = false);

canvas.addEventListener('mouseout', () => isDrawing = false);
canvas.addEventListener('touchcancel', () => isDrawing = false);

// Set Letter
const letterTxt = document.querySelector('#letter');
let letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
letterTxt.innerHTML = letter;

function newLetter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    letterTxt.innerHTML = letter;
}

const newBtn = document.querySelector('#new');
newBtn.addEventListener('click', newLetter);

// Try Again Button
const redoBtn = document.querySelector('#redo');

redoBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// TODO: add touch events https://stackoverflow.com/questions/51333798/how-can-i-make-mousedown-mouseup-trigger-on-mobile-devices
// touch events: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events

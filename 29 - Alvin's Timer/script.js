let countdown;
let stopAlert;
let secondsLeft;
let timeSelected;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const ding = new Audio('sweetalertsound5.wav');
const stopTimerBtn = document.querySelector('#display__stop-timer-btn');
const continueBtn = document.querySelector('#display__continue-timer-btn');
const restartBtn = document.querySelector('#display__restart-timer-btn');

let wakeLock = null;

// Function to request a wake lock
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
            console.log('Wake Lock was released');
        });
        console.log('Wake Lock is active');
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

// Automatically request wake lock when page is not longer
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && wakeLock !== null) {
      requestWakeLock();
  }
});

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    if(secondsLeft < 0) {
      ding.play();
      clearInterval(countdown);
      timer(timeSelected);
      return;
    }
    // display it
    displayTimeLeft(secondsLeft);
    console.log(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function getTime() {
  timeSelected = parseInt(this.dataset.time);
  startTimer(timeSelected);
}

function startTimer(seconds) {
  requestWakeLock();
  stopTimerBtn.style.display = 'flex';
  continueBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  ding.pause();
  ding.currentTime = 0;
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', getTime));

document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  timeSelected = mins * 60;
  startTimer(timeSelected);
  this.reset();
});

stopTimerBtn.addEventListener('click', () => {
  clearInterval(countdown);
  stopTimerBtn.style.display = 'none';
  continueBtn.style.display = 'flex';
  restartBtn.style.display = 'flex';
});

continueBtn.addEventListener('click', () => startTimer(secondsLeft));
restartBtn.addEventListener('click', () => startTimer(timeSelected));

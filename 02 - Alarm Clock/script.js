// get time
function getTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // move second hand
    let secondHand = document.querySelector('.second-hand');
    secondHand.style.rotate = `${6 * seconds}deg`;

    // move minute hand
    let minuteHand = document.querySelector('.min-hand');
    minuteHand.style.rotate = `${6 * minutes}deg`;

    // move hour hand
    let hourHand = document.querySelector('.hour-hand');
    hourHand.style.rotate = `${(30 * hours) + (.5 * minutes)}deg`;
}

// create schedule
const form = document.getElementById('add-info-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let task = document.getElementById('task').value;
    let time = document.getElementById('alarm').value;
    if (task == "" || time == "") {
        alert("Enter and event and an alarm time");
    } else {
        const formData = new FormData(form);
        const formObj = Object.fromEntries(formData);
        addToSchedule(formObj);
        form.reset();
        location.reload();
    }
});

// add the form input to an array
function addToSchedule(data) {
    if (!localStorage.getItem("scheduleArray")) {
        let scheduleArray = [];
        scheduleArray.push(data);
        localStorage.setItem("scheduleArray", JSON.stringify(scheduleArray));
    } else {
        let retString = localStorage.getItem("scheduleArray");
        scheduleArray = JSON.parse(retString);
        scheduleArray.push(data);
        localStorage.setItem("scheduleArray", JSON.stringify(scheduleArray));
    }

}

// display the values in the table
function displaySchedule() {
    const schedule = document.getElementById('schedule');
    const table = document.getElementById('tbody');
    if (!localStorage.getItem("scheduleArray")) {
        return;
    } else {
        let retString = localStorage.getItem("scheduleArray");
        let scheduleArray = JSON.parse(retString);
        let orderedSchedule = scheduleArray.sort((a, b) => a.alarm < b.alarm ? -1 : 1);
        localStorage.setItem("scheduleArray", JSON.stringify(orderedSchedule));
        orderedSchedule.forEach(item => {
            let task = item.task;
            let time = item.alarm;
            let hour = time.slice(0, 2);
            let hourInt = Number(hour);
            if (hourInt > 12) {
                hourInt -= 12
                hour = hourInt.toString();
                time = hour + time.slice(2);
            } else if (hourInt < 10 && hourInt > 0) {
                hour = time.slice(1, 2);
                time = hour + time.slice(2);
            } else if (hourInt == 0) {
                hour = '12';
                time = hour + time.slice(2);
            }
            let row = table.insertRow(-1);
            let ctask = row.insertCell(0);
            let ttask = row.insertCell(1);
            let setAlarm = row.insertCell(2);
            let remove = row.insertCell(3);
            ctask.innerText = task;
            ttask.innerText = time;
            setAlarm.innerText = "⏰"
            remove.innerText = "🗑️";
        });
    }
}

// option to delete event
function deleteEvent() {
    const tbody = document.getElementById('tbody');
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.lastChild.addEventListener('click', () => {
            let rowIndex = index;
            let retString = localStorage.getItem("scheduleArray");
            scheduleArray = JSON.parse(retString);
            scheduleArray.splice(rowIndex, 1);
            localStorage.setItem("scheduleArray", JSON.stringify(scheduleArray));
            location.reload()
        });
    });
    if (localStorage.getItem('scheduleArray') == '[]') {
        localStorage.removeItem('scheduleArray');
    }
}

// option to reset whole schedule
const resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', () => {
    if (!localStorage.getItem('scheduleArray')) {
        return;
    } else {
        localStorage.removeItem('scheduleArray');
        location.reload();
    }
});

function playSound() {
    const audio = document.getElementById('audio');
    audio.currentTime = 0;
    audio.play();
}

function stopSound() {
    const audio = document.getElementById('audio');
    audio.pause();
}

// set alarm
function setAlarm() {
    const tbody = document.getElementById('tbody');
    const rows = tbody.querySelectorAll('tr');
    const timerDiv = document.getElementById('timer');
    let alarmMin;
    let minutes;
    let alarmHour;
    let hours;
    rows.forEach((row, index) => {
        row.childNodes[2].addEventListener('click', () => {
            rows.forEach(line => {
                line.style.background = 'none';
                line.style.color = 'var(--text-color)';
            });
            row.style.color = 'var(--text-color)';
            let isAlarm = true;
            row.style.background = 'var(--accent-color)';
            row.style.color = 'var(--base-color)';
            let rowIndex = index;
            let retString = localStorage.getItem("scheduleArray");
            scheduleArray = JSON.parse(retString);
            let alarmTime = scheduleArray.splice(rowIndex, 1)[0].alarm;
            alarmHour = Number(alarmTime.slice(0, 2));
            alarmMin = Number(alarmTime.slice(-2));
            setInterval(() => {
                let date = new Date();
                hours = date.getHours();
                minutes = date.getMinutes();
                if (checkHour(alarmHour, hours, alarmMin, minutes)) {
                    timerDiv.style.display = 'flex';
                } else {
                    timerDiv.style.display = 'none';
                }
                changeAngle(alarmMin, minutes); 
                let currentTime = `${hours}:${minutes}`;
                if ((hours.toString().length == 1) && (minutes.toString().length  == 1)) {
                    currentTime = `0${hours}:0${minutes}`;
                } else if ((hours.toString().length == 1) && (minutes.toString().length  == 2)) {
                    currentTime = `0${hours}:${minutes}`
                } else if ((hours.toString().length == 2) && (minutes.toString().length == 1)) {
                    currentTime = `${hours}:0${minutes}`
                }
                if (isAlarm == true) {
                    if (alarmTime == currentTime) {
                        isAlarm = false;
                        playSound();
                        row.style.background = 'none';
                        row.style.color = 'var(--text-color)';
                        document.getElementById('timer').style.display = 'none';
                    }
                }
            }, 1000);
        });
    });
}

function checkHour (alarmHour, hours, alarmMin, minutes) {
    if (alarmHour == 0 && hours == 23 && alarmMin < minutes) {
        return true;
    } else if ((hours == alarmHour - 1 && minutes > alarmMin) || (hours == alarmHour && minutes < alarmMin)) {
        return true;
    } else {
        return false;
    }
}

// highlight section of clock for visual countdown
function changeAngle(alarmMin, currentMin) {
    const timerDiv = document.getElementById('timer');

    const xStop = setXStop(alarmMin);
    const yStop = setYStop(alarmMin);
    const xStart = setXStart(currentMin);
    const yStart = setYStart(currentMin);
    const xPt1 = setXPt1(alarmMin, currentMin, xStart, yStart);
    const yPt1 = setYPt1(alarmMin, currentMin, xStart, yStart);
    const xPt2 = setXPt2(alarmMin, currentMin, xStart, yStart);
    const yPt2 = setYPt2(alarmMin, currentMin, xStart, yStart);
    const xPt3 = setXPt3(alarmMin, currentMin, xStart, yStart);
    const yPt3 = setYPt3(alarmMin, currentMin, xStart, yStart);
    const xPt4 = setXPt4(alarmMin, currentMin, xStart, yStart);
    const yPt4 = setYPt4(alarmMin, currentMin, xStart, yStart);

    timerDiv.style.setProperty('--stop', `${xStop}% ${yStop}%`);
    timerDiv.style.setProperty('--start', `${xStart}% ${yStart}%`);
    timerDiv.style.setProperty('--pt1', `${xPt1}% ${yPt1}%`);
    timerDiv.style.setProperty('--pt2', `${xPt2}% ${yPt2}%`);
    timerDiv.style.setProperty('--pt3', `${xPt3}% ${yPt3}%`);
    timerDiv.style.setProperty('--pt4', `${xPt4}% ${yPt4}%`);
}

// get clip-path points
function setXStop(minutes) {
    const toRad = Math.PI / 180;
    let deg = minutes * 6
    let point;
    if (minutes == 0) {
        point = 50;
    } else if (minutes > 0 && minutes < 8) {
        point = 50 + Math.tan(deg * toRad) * 50;
    } else if (minutes >= 8 && minutes < 23) {
        point = 100;
    } else if (minutes >= 23 && minutes < 30) {
        deg = 180 - deg;
        point = 50 + Math.tan(deg * toRad) * 50;
    } else if (minutes == 30) {
        point = 50;
    } else if (minutes > 30 && minutes < 38) {
        deg = deg - 180;
        point = 50 - Math.tan(deg * toRad) * 50;
    } else if (minutes >= 38 && minutes < 53) {
        point = 0;
    } else if (minutes >= 53 && minutes < 60) {
        deg = 360 - deg;
        point = 50 - Math.tan(deg * toRad) * 50;
    }
    return point;
}

function setYStop(minutes) {
    const toRad = Math.PI / 180;
    let deg = minutes * 6
    let point;
    if (minutes == 0) {
        point = 0;
    } else if (minutes > 0 && minutes < 8) {
        point = 0;
    } else if (minutes >= 8 && minutes < 15) {
        deg = 90 - deg;
        point = 50 - Math.tan(deg * toRad) * 50;
    } else if (minutes == 15) {
        point = 50;
    } else if (minutes > 15 && minutes < 23) {
        deg = deg - 90;
        point = 50 + Math.tan(deg * toRad) * 50;
    } else if (minutes >= 23 && minutes < 38) {
        point = 100;
    } else if (minutes >= 38 && minutes < 45) {
        deg = 270 - deg;
        point = 50 + Math.tan(deg * toRad) * 50;
    } else if (minutes == 45) {
        point = 50;
    } else if (minutes > 45 && minutes < 53) {
        deg = deg - 270;
        point = 50 - Math.tan(deg * toRad) * 50;
    }
    else if (minutes >= 53 && minutes < 60) {
        point = 0;
    }
    return point;
}

function setXStart(minutes) {
    const toRad = Math.PI / 180;
    let deg = minutes * 6
    let point;
    if (minutes == 0) {
        point = 50;
    } else if (minutes > 0 && minutes < 8) { 
        point = 50 + Math.tan(deg * toRad) * 50;
    } else if (minutes >= 8 && minutes < 15) {
        point = 100
    } else if (minutes == 15) {
        point = 100;
    } else if (minutes > 15 && minutes < 23) {
        point = 100;
    } else if (minutes >= 23 && minutes < 30) {
        deg = 180 - deg;
        point = 50 + Math.tan(deg * toRad) * 50;
    } else if (minutes == 30) {
        point = 50;
    } else if (minutes > 30 && minutes < 38) {
        point = 50 - Math.tan(deg * toRad) * 50;
    } else if (minutes >= 38 && minutes < 45) {
        point = 0;
    } else if (minutes == 45) {
        point = 0;
    } else if (minutes > 45 && minutes < 53) {
        point = 0
    } else if (minutes >= 53 && minutes < 60) {
        deg = 360 - deg;
        point = 50 - Math.tan(deg * toRad) * 50;
    }
    return point;
}

function setYStart(minutes) {
    const toRad = Math.PI / 180;
    let deg = minutes * 6
    let point;
    if (minutes == 0) {
        point = 0;
    } else if (minutes > 0 && minutes < 8) {
        point = 0;
    } else if (minutes >= 8 && minutes < 15) {
        deg = 90 - deg;
        point = 50 - Math.tan(deg * toRad) * 50;
    } else if (minutes == 15) {
        point = 50;
    } else if (minutes > 15 && minutes < 23) {
        deg = deg - 90;
        point = 50 + Math.tan(deg * toRad) * 50;
    } else if (minutes >= 23 && minutes < 30) {
        point = 100;
    } else if (minutes == 30) {
        point = 100;
    } else if (minutes > 30 && minutes < 38) {
        point = 100;
    } else if (minutes >= 38 && minutes < 45) {
        deg = 270 - deg;
        point = 50 + Math.tan(deg * toRad) * 50;
    } else if (minutes == 45) {
        point = 50;
    } else if (minutes > 45 && minutes < 53) {
        deg = deg - 270;
        point = 50 - Math.tan(deg * toRad) * 50;
    } else if (minutes >= 53 && minutes < 60) {
        point = 0;
    }
    return point;
}

function setXPt1(minutes, currentMin, xStart, yStart) {
    let point;
    if (minutes == currentMin) {
        point = 50;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin < 53 && currentMin > minutes)) {
        if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = xStart;
        } else if (yStart == 100) {
            point = xStart;
        } else if (xStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 53 && currentMin < 60)) {
        point = xStart;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 0 && currentMin < minutes)) {
        point = xStart;
    }
    else if ((minutes >= 8 && minutes < 23) && !(currentMin >= 8 && currentMin < minutes)) {
        if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = xStart;
        } else if (xStart == 0) {
            point = xStart;
        } else if (yStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 8 && minutes < 23) && (currentMin >= 8 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 23 && minutes < 38) && !(currentMin >= 23 && currentMin < minutes)) {
        if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = xStart;
        } else if (yStart == 0) {
            point = xStart;
        } else if (xStart == 100) {
            point = xStart;
        }
    } else if ((minutes >= 23 && minutes < 38) && (currentMin >= 23 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 38 && minutes < 53) && !(currentMin >=38 && currentMin < minutes)){
        if (xStart == 0) {
            point = 0;
        } else if (yStart == 0) {
            point = xStart;
        } else if (xStart == 100) {
            point = xStart;
        } else if (yStart == 100) {
            point = xStart;
        }
    } else if ((minutes >= 38 && minutes < 53) && (currentMin >=38 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && !(currentMin >= 53 && currentMin < minutes)) {
        if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = xStart;
        } else if (yStart == 100) {
            point = xStart;
        } else if (xStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin > minutes)) {
        point = 100;
    } 
    return point;
}

function setYPt1(minutes, currentMin, xStart, yStart) {
    let point;
    if (minutes == currentMin) {
        point = 50;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin < 53 && currentMin > minutes)) {
        if (yStart == 0) {
            point = 0;
        } else if (xStart == 100) {
            point = yStart;
        } else if (yStart == 100) {
            point = yStart;
        } else if (xStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 53 && currentMin < 60)) {
        point = yStart;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 0 && currentMin < minutes)) {
        point = yStart;
    }
    else if ((minutes >= 8 && minutes < 23) && !(currentMin >= 8 && currentMin < minutes)) {
        if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = yStart;
        } else if (xStart == 0) {
            point = yStart;
        } else if (yStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 8 && minutes < 23) && (currentMin >= 8 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 23 && minutes < 38) && !(currentMin >= 23 && currentMin < minutes)) {
        if (yStart == 100) {
            point = 100;
        } else if (xStart == 0) {
            point = yStart;
        } else if (yStart == 0) {
            point = yStart;
        } else if (xStart == 100) {
            point = yStart;
        }
    } else if ((minutes >= 23 && minutes < 38) && (currentMin >= 23 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 38 && minutes < 53) && !(currentMin >=38 && currentMin < minutes)){
        if (xStart == 0) {
            point = 0;
        } else if (yStart == 0) {
            point = yStart;
        } else if (xStart == 100) {
            point = yStart;
        } else if (yStart == 100) {
            point = yStart;
        }
    } else if ((minutes >= 38 && minutes < 53) && (currentMin >=38 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 53 && minutes < 60) && !(currentMin >= 53 && currentMin < minutes)) {
        if (yStart == 0) {
            point = 0;
        } else if (xStart == 100) {
            point = yStart;
        } else if (yStart == 100) {
            point = yStart;
        } else if (xStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin > minutes)) {
        point = 0;
    } 
    return point;
}

function setXPt2(minutes, currentMin, xStart, yStart) {
    let point;
    if (minutes == currentMin) {
        point = 50;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin < 53 && currentMin > minutes)) {
        if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = xStart;
        } else if (xStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 53 && currentMin < 60)) {
        point = xStart;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 0 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 8 && minutes < 23) && !(currentMin >= 8 && currentMin < minutes)) {
        if (xStart == 100) {
            point = 0;
        } else if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = xStart;
        } else if (yStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 8 && minutes < 23) && (currentMin >= 8 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 23 && minutes < 38) && !(currentMin >= 23 && currentMin < minutes)) {
        if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = 0;
        } else if (yStart == 0) {
            point = xStart;
        } else if (xStart == 100) {
            point = xStart;
        }
    } else if ((minutes >= 23 && minutes < 38) && (currentMin >= 23 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 38 && minutes < 53) && !(currentMin >=38 && currentMin < minutes)){
        if (xStart == 0) {
            point = 100;
        } else if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = xStart;
        } else if (yStart == 100) {
            point = xStart;
        }
    } else if ((minutes >= 38 && minutes < 53) && (currentMin >=38 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && !(currentMin >= 53 && currentMin < minutes)) {
        if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = xStart;
        } else if (xStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin > minutes)) {
        point = 100;
    } 
    return point;
}

function setYPt2(minutes, currentMin, xStart, yStart) {
    let point;
    if (minutes == currentMin) {
        point = 50;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin < 53 && currentMin > minutes)) {
        if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = yStart;
        } else if (xStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 53 && currentMin < 60)) {
        point = yStart;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 0 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 8 && minutes < 23) && !(currentMin >= 8 && currentMin < minutes)) {
        if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = 100;
        } else if (xStart == 0) {
            point = yStart;
        } else if (yStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 8 && minutes < 23) && (currentMin >= 8 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 23 && minutes < 38) && !(currentMin >= 23 && currentMin < minutes)) {
        if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = 0;
        } else if (yStart == 0) {
            point = yStart;
        } else if (xStart == 100) {
            point = yStart;
        }
    } else if ((minutes >= 23 && minutes < 38) && (currentMin >= 23 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 38 && minutes < 53) && !(currentMin >=38 && currentMin < minutes)){
        if (xStart == 0) {
            point = 0;
        } else if (yStart == 0) {
            point = 0;
        } else if (xStart == 100) {
            point = yStart;
        } else if (yStart == 100) {
            point = yStart;
        }
    } else if ((minutes >= 38 && minutes < 53) && (currentMin >=38 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 53 && minutes < 60) && !(currentMin >= 53 && currentMin < minutes)) {
        if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = yStart;
        } else if (xStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin > minutes)) {
        point = 100;
    } 
    return point;
}

function setXPt3(minutes, currentMin, xStart, yStart) {
    let point;
    if (minutes == currentMin) {
        point = 50;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin < 53 && currentMin > minutes)) {
        if (yStart == 0) {
            point = 0;
        } else if (xStart == 100) {
            point = 0;
        } else if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 53 && currentMin < 60)) {
        point = xStart;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 0 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 8 && minutes < 23) && !(currentMin >= 8 && currentMin < minutes)) {
        if (xStart == 100) {
            point = 0;
        } else if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = 0;
        } else if (yStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 8 && minutes < 23) && (currentMin >= 8 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 23 && minutes < 38) && !(currentMin >= 23 && currentMin < minutes)) {
        if (yStart == 100) {
            point = 100;
        } else if (xStart == 0) {
            point = 100;
        } else if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = xStart;
        }
    } else if ((minutes >= 23 && minutes < 38) && (currentMin >= 23 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 38 && minutes < 53) && !(currentMin >=38 && currentMin < minutes)){
        if (xStart == 0) {
            point = 100;
        } else if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = xStart;
        }
    } else if ((minutes >= 38 && minutes < 53) && (currentMin >=38 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && !(currentMin >= 53 && currentMin < minutes)) {
        if (yStart == 0) {
            point = 0;
        } else if (xStart == 100) {
            point = 0;
        } else if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = xStart;
        }
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin > minutes)) {
        point = 0;
    } 
    return point;
}

function setYPt3(minutes, currentMin, xStart, yStart) {
    let point;
    if (minutes == currentMin) {
        point = 50;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin < 53 && currentMin > minutes)) {
        if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = 100;
        } else if (xStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 53 && currentMin < 60)) {
        point = yStart;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 0 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 8 && minutes < 23) && !(currentMin >= 8 && currentMin < minutes)) {
        if (xStart == 100) {
            point = 0;
        } else if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = 0;
        } else if (yStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 8 && minutes < 23) && (currentMin >= 8 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 23 && minutes < 38) && !(currentMin >= 23 && currentMin < minutes)) {
        if (yStart == 100) {
            point = 0;
        } else if (xStart == 0) {
            point = 0;
        } else if (yStart == 0) {
            point = 0;
        } else if (xStart == 100) {
            point = yStart;
        }
    } else if ((minutes >= 23 && minutes < 38) && (currentMin >= 23 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 38 && minutes < 53) && !(currentMin >=38 && currentMin < minutes)){
        if (xStart == 0) {
            point = 100;
        } else if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = yStart;
        }
    } else if ((minutes >= 38 && minutes < 53) && (currentMin >=38 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 53 && minutes < 60) && !(currentMin >= 53 && currentMin < minutes)) {
        if (yStart == 0) {
            point = 100;
        } else if (xStart == 100) {
            point = 100;
        } else if (yStart == 100) {
            point = 100;
        } else if (xStart == 0) {
            point = yStart;
        }
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin > minutes)) {
        point = 100;
    } 
    return point;
}

function setXPt4(minutes, currentMin, xStart, yStart) {
    let point;
    if (minutes == currentMin) {
        point = 50;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin < 53 && currentMin > minutes)) {
        point = 0;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 53 && currentMin < 60)) {
        point = xStart;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 0 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 8 && minutes < 23) && !(currentMin >= 8 && currentMin < minutes)) {
        point = 100;
    } else if ((minutes >= 8 && minutes < 23) && (currentMin >= 8 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 23 && minutes < 38) && !(currentMin >= 23 && currentMin < minutes)) {
        point = 100;
    } else if ((minutes >= 23 && minutes < 38) && (currentMin >= 23 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 38 && minutes < 53) && !(currentMin >=38 && currentMin < minutes)){
       point = 0;
    } else if ((minutes >= 38 && minutes < 53) && (currentMin >=38 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && !(currentMin >= 53 && currentMin < minutes)) {
        point = 0;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin > minutes)) {
        point = 0;
    } 
    return point;
}

function setYPt4(minutes, currentMin, xStart, yStart) {
    let point;
    if (minutes == currentMin) {
        point = 50;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin < 53 && currentMin > minutes)) {
        point = 0;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 53 && currentMin < 60)) {
        point = yStart;
    } else if ((minutes >= 0 && minutes < 8) && (currentMin >= 0 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 8 && minutes < 23) && !(currentMin >= 8 && currentMin < minutes)) {
        point = 0;
    } else if ((minutes >= 8 && minutes < 23) && (currentMin >= 8 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 23 && minutes < 38) && !(currentMin >= 23 && currentMin < minutes)) {
        point = 100;
    } else if ((minutes >= 23 && minutes < 38) && (currentMin >= 23 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 38 && minutes < 53) && !(currentMin >=38 && currentMin < minutes)){
        point = 100;
    } else if ((minutes >= 38 && minutes < 53) && (currentMin >=38 && currentMin < minutes)) {
        point = yStart;
    } else if ((minutes >= 53 && minutes < 60) && !(currentMin >= 53 && currentMin < minutes)) {
        point = 0
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin < minutes)) {
        point = xStart;
    } else if ((minutes >= 53 && minutes < 60) && (currentMin >= 53 && currentMin > minutes)) {
        point = 0;
    } 
    return point;
}

// run code
setInterval(getTime, 1000);
displaySchedule();
setAlarm();
deleteEvent();




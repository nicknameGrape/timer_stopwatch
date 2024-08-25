"use strict"

function mmss() {
	if (timerTime >= 0) {
		var minutes = Math.floor(timerTime/60).toString().padStart(2, "0");
		var seconds = Math.floor(timerTime%60).toString().padStart(2, "0");
		return minutes + ":" + seconds;
	} else {
		if (performance.now()%500 > 250) {
			return "XX:XX";
		} else {
			return "@@:@@";
		}
	}
}

function mmsshh() {
	var minutes = Math.floor(stopwatchTime/60).toString().padStart(2, "0");
	var seconds = Math.floor(stopwatchTime%60).toString().padStart(2, "0");
	var hundredths = (stopwatchTime%1).toFixed(2).toString().substring(2, 4);
	return minutes + ":" + seconds + ":" + hundredths;
}

function addInput(c) {
	input += c;
	input = input.slice(-4);
	input = input.padStart(4, "0");
	var seconds = parseInt(input.slice(2, 4));
	var minutes = parseInt(input.slice(0, 2));
	if (seconds > 60) {
		minutes += 1;
		seconds = seconds%60;
	}
	timerTime = minutes*60 + seconds;
	keypad_display.innerHTML = input.slice(0, 2) + ":" + input.slice(2, 4);
	clearTimeout(inputTimeout);
	inputTimeout = setTimeout(function () {
		input = "";
	}, 3000);
}

function animateTimer(now) {
	if (lastTime === null) {
		lastTime = now;
	} else {
		var elapsed = now - lastTime;
		timerTime -= elapsed/1000;
		keypad_display.innerHTML = mmss();
		display_timer.innerHTML = mmss();
		if (timerTime < 0) {
			display_timer.style.background = "red";
			if (horn.canPlay === true) {
				console.log("playing horn");
				horn.play();
				horn.canPlay = false;
			}
		}
		lastTime = now;
	}
	timerAnimationRequest = requestAnimationFrame(animateTimer);
}

function animateStopwatch(now) {
	if (lastTimeStopwatch === null) {
		lastTimeStopwatch = now;
	} else {
		var elapsed = now - lastTimeStopwatch;
		stopwatchTime += elapsed/1000;
		stopwatch_mmsshh.innerHTML = mmsshh();
		lastTimeStopwatch = now;
	}
	stopwatchAnimationRequest = requestAnimationFrame(animateStopwatch);
}

function timerReset() {
	cancelAnimationFrame(timerAnimationRequest);
	timerAnimationRequest = null;
	lastTime = null;
	clearTimeout(inputTimeout);
	timerTime = 0;
	keypad_display.innerHTML = mmss();
	input = "";
	buttonStartStop.innerHTML = "Start";
	display_timer.innerHTML = "";
	display_timer.style.background = "";
	horn.pause();
	horn.currentTime = 0;
	horn.canPlay = true;
}

var DEFAULT_TIME = 60;
var timerTime = DEFAULT_TIME;
var input = "";
var memory = "0100";
var inputTimeout = null;
var timerAnimationRequest = null;
var lastTime = null;
var stopwatchTime = 0;
var lastTimeStopwatch = null;
var stopwatchAnimationRequest = null;

var tab_timer = document.getElementById("tab_timer");
var timer = document.getElementById("timer");
var keypad = document.getElementById("keypad");
var keypad_display = document.getElementById("keypad_display");
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");
var button4 = document.getElementById("button4");
var button5 = document.getElementById("button5");
var button6 = document.getElementById("button6");
var button7 = document.getElementById("button7");
var button8 = document.getElementById("button8");
var button9 = document.getElementById("button9");
var button0 = document.getElementById("button0");
var button00 = document.getElementById("button00");
var buttonStartStop = document.getElementById("button_startstop");
var buttonReset = document.getElementById("button_reset");
var horn = document.createElement("audio");
horn.src = "air_horn.mp3";
horn.canPlay = true;

var tab_stopwatch = document.getElementById("tab_stopwatch");
var stopwatch = document.getElementById("stopwatch");
var stopwatch_startstop = document.getElementById("stopwatch_startstop");
var stopwatch_mmsshh = document.getElementById("stopwatch_mmsshh");

var tab_bomb = document.getElementById("tab_bomb");
var bomb = document.getElementById("bomb");

let bombMin = 5;
let bombMax = localStorage.getItem("bomb_max");
if (bombMax === null) {
	bombMax = 30;
} else {
	bombMax = parseInt(bombMax);
}
const spanBombMaxReadout = document.getElementById("bomb_max_readout");
const buttonBombPlus = document.getElementById("bomb_plus");
const buttonBombMinus = document.getElementById("bomb_minus");
const buttonBombDefault = document.getElementById("bomb_default");
const buttonBombStart = document.getElementById("bomb_start");
const buttonBombReset = document.getElementById("bomb_reset");
const divBombDisplay = document.getElementById("bomb_display");
const canvasBomb = document.getElementById("bomb_canvas");
const contextBomb = canvasBomb.getContext("2d");
const imageBombUnlit = document.createElement("img");
const imageBombLit1 = document.createElement("img");
const imageBombLit2 = document.createElement("img");
const imageBombFlower = document.createElement("img");
imageBombUnlit.onload = function() {
	canvasBomb.width = imageBombUnlit.width; canvasBomb.height = imageBombUnlit.height;
	contextBomb.drawImage(imageBombUnlit, 0, 0);
};
imageBombUnlit.src = "bomb_unlit.png";
imageBombLit1.src = "bomb_lit1.png";
imageBombLit2.src = "bomb_lit2.png";
imageBombFlower.src = "bomb_flower.png";
let bombLightTime = null;
let bombDuration = null;
function animateBomb() {
	let elapsed = performance.now() - bombLightTime;
	console.log(bombLightTime, bombDuration, elapsed);
	if (elapsed > bombDuration) {
		window.cancelAnimationFrame(bomb_animation_request);
		horn.play();
		contextBomb.clearRect(0, 0, canvasBomb.width, canvasBomb.height);
		contextBomb.drawImage(imageBombFlower, 0, 0);
	} else {
		if (elapsed%200 < 100) {
			contextBomb.clearRect(0, 0, canvasBomb.width, canvasBomb.height);
			contextBomb.drawImage(imageBombLit1, 0, 0);
		} else {
			contextBomb.clearRect(0, 0, canvasBomb.width, canvasBomb.height);
			contextBomb.drawImage(imageBombLit2, 0, 0);
		}
		bomb_animation_request = window.requestAnimationFrame(animateBomb);
	}
}
let bomb_animation_request;
spanBombMaxReadout.innerHTML = bombMax + "s";

keypad_display.innerHTML = mmss();

window.addEventListener("focus", function (ev) {
	horn.canPlay = false;
	setInterval(function () {if (timerTime > 0) {horn.canPlay = true;}}, 1000);
});

tab_timer.addEventListener("click", function (ev) {
	stopwatch.style.display = "none";
	bomb.style.display = "none";
	timer.style.display = "flex";
});
tab_stopwatch.addEventListener("click", function (ev) {
	timer.style.display = "none";
	timerReset();
	bomb.style.display = "none";
	stopwatch.style.display = "flex";
});
tab_bomb.addEventListener("click", function (ev) {
	timer.style.display = "none";
	timerReset();
	stopwatch.style.display = "none";
	bomb.style.display = "flex";
});
button1.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("1");
});
button2.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("2");
});
button3.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("3");
});
button4.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("4");
});
button5.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("5");
});
button6.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("6");
});
button7.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("7");
});
button8.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("8");
});
button9.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("9");
});
button0.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("0");
});
button00.addEventListener("click", function (ev) {
	if (timerAnimationRequest !== null) {timerReset();} addInput("00");
});
buttonReset.addEventListener("click", function (ev) {
	timerReset();
});
buttonStartStop.addEventListener("click", function (ev) {
	if (timerAnimationRequest === null) {
		timerAnimationRequest = requestAnimationFrame(animateTimer);
		buttonStartStop.innerHTML = "Pause";
		display_timer.innerHTML = mmss();
		if (timerTime > 0) {
			display_timer.style.background = "lime";
		} else {
			horn.currentTime = 0;
			horn.play();
		}
	} else {
		cancelAnimationFrame(timerAnimationRequest);
		timerAnimationRequest = null;
		lastTime = null;
		buttonStartStop.innerHTML = "Start";
		if (timerTime > 0) {
			display_timer.style.background = "yellow";
		} else {
			horn.pause();
		}
	}
});
stopwatch_startstop.addEventListener("click", function (ev) {
	if (stopwatchAnimationRequest === null) {
		stopwatchAnimationRequest = requestAnimationFrame(animateStopwatch);
		stopwatch_startstop.innerHTML = "Pause";
		stopwatch_mmsshh.innerHTML = mmsshh();
		stopwatch_mmsshh.style.background = "lime";
	} else {
		cancelAnimationFrame(stopwatchAnimationRequest);
		stopwatchAnimationRequest = null;
		lastTimeStopwatch = null;
		stopwatch_startstop.innerHTML = "Start";
		stopwatch_mmsshh.style.background = "yellow";
	}
});
stopwatch_reset.addEventListener("click", function (ev) {
	cancelAnimationFrame(stopwatchAnimationRequest);
	stopwatchAnimationRequest = null;
	lastTimeStopwatch = null;
	stopwatch_startstop.innerHTML = "Start";
	stopwatch_mmsshh.style.background = "lightBlue";
	stopwatchTime = 0;
	stopwatch_mmsshh.innerHTML = mmsshh();
});
buttonBombPlus.addEventListener("click", function (ev) {
	bombMax += 5;
	spanBombMaxReadout.innerHTML = bombMax + "s";
	localStorage.setItem("bomb_max", bombMax);
});
buttonBombMinus.addEventListener("click", function (ev) {
	if (bombMax > bombMin) {bombMax -= 5;}
	spanBombMaxReadout.innerHTML = bombMax + "s";
	localStorage.setItem("bomb_max", bombMax);
});
buttonBombDefault.addEventListener("click", function (ev) {
	bombMax = 30;
	spanBombMaxReadout.innerHTML = bombMax + "s";
	localStorage.setItem("bomb_max", bombMax);
});
buttonBombStart.addEventListener("click", function (ev) {
	window.cancelAnimationFrame(bomb_animation_request);
	horn.pause(); horn.currentTime = 0;
	bomb_animation_request = window.requestAnimationFrame(animateBomb);
	bombLightTime = performance.now();
	bombDuration = (Math.random()*(bombMax - bombMin) + bombMin)*1000;
	console.log(bombDuration);
});
buttonBombReset.addEventListener("click", function (ev) {
	window.cancelAnimationFrame(bomb_animation_request);
	horn.pause(); horn.currentTime = 0;
	contextBomb.clearRect(0, 0, canvasBomb.width, canvasBomb.height);
	contextBomb.drawImage(imageBombUnlit, 0, 0);
});

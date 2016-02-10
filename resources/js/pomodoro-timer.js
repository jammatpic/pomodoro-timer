// SHOULD ADD CIRCULAR PROGRESS BAR AND SOUNDS
// ADD COMMENTS
var clockActive = false; // if clock is in middle of countdown
var countSecs; // amount of seconds timer is set to, in total
var timerSecs; // amount of seconds in timer
var pauseTime = -1; // amount of time left if paused
var sessionDone = false; // if session has just been completed

function changeLength(value, buttonType) {
	displayValue = $(value).text();
	if (buttonType == "+") {
		if (displayValue < 59) {
			$(value).text(Number(displayValue) + 1);
		}	
	} else {
		if (displayValue > 1) {
			$(value).text(Number(displayValue) - 1);
		}	
	}
}

function timerStart(timerLength, timerType) {
	document.getElementById("btn-start").setAttribute("class", "btn btn-pause");
	$("#btn-start").text("Pause");
	if (timerType == "session") {
		$("#status").text("Session");
	} else if (timerType == "break") {
		$("#status").text("Break");
	}
	clearInterval(countSecs);
	var timerMins = Number(timerLength);
	if (pauseTime == -1) {
		timerSecs = timerMins * 60;
	} else {
		timerSecs = pauseTime;
		pauseTime = -1;
	}
	clockActive = true;

	countSecs = setInterval(function() { 
		timerSecs = Number(timerSecs) - 1;
		if (timerSecs % 60 >= 10) {
			$("#time").text(Math.floor(timerSecs / 60) + ":" + timerSecs % 60);
		} else {
			$("#time").text(Math.floor(timerSecs / 60) + ":0" + timerSecs % 60);
		}
		if (timerSecs == 0) {
			timerSecs = timerMins * 60;
			clockActive = false;
			clearInterval(countSecs);
			if (timerType == "session") {
				$("#time").text($("#break-length").text() + ":" + "00");
				sessionDone = true;
				timerStart($("#break-length").text(), "break");
			} else if (timerType == "break") {
				$("#time").text($("#session-length").text() + ":" + "00");
				sessionDone = false;
				timerStart($("#session-length").text(), "session");
			}
		}
	}, 1000);
}

function timer() {
	var sessionLength = $("#session-length").text();
	var breakLength = $("#break-length").text();
	if (clockActive == true) { //for pausing
		pauseTime = timerSecs;
		clearInterval(countSecs);
		clockActive = false;
		document.getElementById("btn-start").setAttribute("class", "btn btn-normal");
		$("#btn-start").text("Start");
	} else {
		if (sessionDone == false) { // if last timer was a break
			timerStart(sessionLength, "session");
		} else { // if last timer was a session
			timerStart(breakLength, "break");
		}
	}
}

$(".break-change").on("click", function() {
	if (clockActive != true && sessionDone == true) { // if clock is not active, reset all timers with new info
		changeLength("#break-length", $(this).text());
		$("#time").text($("#break-length").text() + ":00");
		clearInterval(countSecs);
		sessionDone = true;
		pauseTime = -1;
		clockActive = false;
		document.getElementById("btn-start").setAttribute("class", "btn btn-normal");
		$("#btn-start").text("Start");
		$("#debug").text(pauseTime);
	} else {
		changeLength("#break-length", $(this).text()); // if clock is active, set the next timer
	}
});

$(".session-change").on("click", function() {
	if (clockActive != true && sessionDone == false) { 
		changeLength("#session-length", $(this).text());
		$("#time").text($("#session-length").text() + ":00");
		clearInterval(countSecs);
		sessionDone = false;
		pauseTime = -1;
		clockActive = false;
		document.getElementById("btn-start").setAttribute("class", "btn btn-normal");
		$("#btn-start").text("Start");
		$("#debug").text(pauseTime);
	} else {
		changeLength("#session-length", $(this).text()); 
	}
});

$("#btn-start").on("click", function() {
	timer();
});

$("#btn-reset").on("click", function() {
	$("#time").text($("#session-length").text() + ":00");
	$("#status").text("Session");
	clearInterval(countSecs);
	sessionDone = false;
	pauseTime = -1;
	clockActive = false;
	document.getElementById("btn-start").setAttribute("class", "btn btn-normal");
	$("#btn-start").text("Start");
	$("#debug").text(pauseTime);
});
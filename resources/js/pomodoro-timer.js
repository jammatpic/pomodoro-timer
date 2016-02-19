var clockActive = false; // indicates if clock is in middle of countdown or not
var countSecs; // amount of seconds timer is set to, in total
var timerSecs; // amount of seconds in timer currently
var pauseTime = -1; // amount of time left if paused
var sessionDone = false; // indicates if session has just been completed
// sound effects
var bleep = new Audio("resources/sound/bleep.mp3");
var beep = new Audio("resources/sound/beep.mp3");

// enables changing length of break and session
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

// starts timer counting down
function timerStart(timerLength, timerType) {
    // changes start button to a pause button, and displays session/break status
	document.getElementById("btn-start").setAttribute("class", "btn btn-pause");
	$("#btn-start").text("Pause");
	if (timerType == "session") {
		$("#status").text("Session");
	} else if (timerType == "break") {
		$("#status").text("Break");
	}
    //clears and resets timer to a given length
	clearInterval(countSecs);
	var timerMins = Number(timerLength);
    // gets the right time if previously paused (if pauseTime is -1, the timer hasn't been paused.)
	if (pauseTime == -1) {
		timerSecs = timerMins * 60;
	} else {
		timerSecs = pauseTime;
		pauseTime = -1;
	}
	clockActive = true;

	countSecs = setInterval(function() { 
		timerSecs = Number(timerSecs) - 1;
        // displays text of timer
		if (timerSecs % 60 >= 10) {
			$("#time").text(Math.floor(timerSecs / 60) + ":" + timerSecs % 60);
		} else {
			$("#time").text(Math.floor(timerSecs / 60) + ":0" + timerSecs % 60);
		}
        // if timer reaches zero...
		if (timerSecs == 0) {
			timerSecs = timerMins * 60;
			clockActive = false;
			clearInterval(countSecs);
            // if last timer was a session, start a break
			if (timerType == "session") {
				$("#time").text($("#break-length").text() + ":" + "00");
				sessionDone = true;
                beep.play();
				timerStart($("#break-length").text(), "break");
            // if last timer was a break, start a session
			} else if (timerType == "break") {
				$("#time").text($("#session-length").text() + ":" + "00");
				sessionDone = false;
                bleep.play();
				timerStart($("#session-length").text(), "session");
			}
		}
	}, 1);
}

// initialises timer once button is pressed
function timer() {
	var sessionLength = $("#session-length").text();
	var breakLength = $("#break-length").text();
    // pauses timer if currently counting down
	if (clockActive == true) { 
		pauseTime = timerSecs;
		clearInterval(countSecs);
		clockActive = false;
		document.getElementById("btn-start").setAttribute("class", "btn btn-normal");
		$("#btn-start").text("Start");
    // starts timer if not currently counting down
	} else {
		if (sessionDone == false) { // if last timer was a break
			timerStart(sessionLength, "session"); // start a session
		} else { // if last timer was a session
			timerStart(breakLength, "break"); // start a break
		}
	}
}

$(document).ready(function() {
    // when changing length of break
    $(".break-change").on("click", function() {
        // if clock is not counting down, reset timer from start with new break length
        if (clockActive != true && sessionDone == true) {
            changeLength("#break-length", $(this).text());
            $("#time").text($("#break-length").text() + ":00");
            clearInterval(countSecs);
            sessionDone = true;
            pauseTime = -1;
            clockActive = false;
            document.getElementById("btn-start").setAttribute("class", "btn btn-normal");
            $("#btn-start").text("Start");
            $("#debug").text(pauseTime);
        // if clock is not counting down, set the length of the next break
        } else {
            changeLength("#break-length", $(this).text()); 
        }
    });

    // when changing length of session
    $(".session-change").on("click", function() {
        // if clock is not counting down, reset timer from start with new session length
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
        // if clock is not counting down, set the length of the next session
        } else {
            changeLength("#session-length", $(this).text()); 
        }
    });

    // starting/pausing the timer
    $("#btn-start").on("click", function() {
        timer();
    });

    // resetting the timer
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
});
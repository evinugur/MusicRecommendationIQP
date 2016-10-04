var clickableClassNames = [
	{className: 'thumbDownButton', eventName: "Thumbs Down"},
	{className: 'thumbUpButton', eventName: "Thumbs Up"},
	{className: 'playButton', eventName: "Play"},
	{className: 'pauseButton', eventName: "Pause"},
	{className: 'skipButton', eventName: "Skip"}];

/* chrome will run the script when the page is loading; this gets tricky becuase Pandora loads a splashscreen with a 
multitutde of async requests. What we can do is periorically probe until the splash screen is gone in the dom via timeout
polling */

var TIMEOUT_INTERVAL = 500;

// just used for diagnostic printing; shows how the current async timeout request we are on
var loadingTime = 0;

function bindEventsAfterSplashScreen() {
	if (document.getElementById("splash").style.display !== 'none') {
		// the splash screen is still visible; try again
		console.log(++loadingTime + ".) Loading Splash Screen");
		setTimeout(bindEventsAfterSplashScreen, TIMEOUT_INTERVAL);
	}
	else {
		// additional timeout delay just to wait and make sure
		setTimeout(injectListeners, TIMEOUT_INTERVAL);
	}
}


function injectListeners() {
	clickableClassNames.forEach(function(currentValue, index, array) {
			var element = document.getElementsByClassName(currentValue.className)[0].children[0];
			element.onclick = function() {
				// TODO make logging event request here - we can look at currentValue to look at what was played
				console.log("Current User:\t" + getCurrentUsername());
				console.log("Current Station:\t" + getCurrentStationName());
				console.log("TRACK EVENT:\t" + currentValue.eventName);
			};
	});
}

bindEventsAfterSplashScreen();

function getCurrentStationName() {
	var container = document.getElementsByClassName('stationListItem selected')[0];
	return container.getElementsByClassName('stationNameText')[0].innerHTML.trim();
}

function getCurrentUsername() {
	return document.getElementsByClassName('userName')[0].innerHTML;
}
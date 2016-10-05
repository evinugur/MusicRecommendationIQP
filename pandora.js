// these refer to events that can be tracked directky by clicking on a DOM element
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
var loadingDelayCount = 0;
function bindEventsAfterSplashScreen() {
	if (document.getElementById("splash").style.display !== 'none') {
		// the splash screen is still visible; try again
		console.log(++loadingDelayCount + ".) Loading Splash Screen");
		setTimeout(bindEventsAfterSplashScreen, TIMEOUT_INTERVAL);
	}
	else {
		// additional timeout delay just to wait and make sure
		setTimeout(init, TIMEOUT_INTERVAL);
	}
}


function init() {
	// prevents participants from muddling with data 
	document.getElementById('shuffleContainer').remove();
	injectListeners();
}

function injectListeners() {
	clickableClassNames.forEach(function(currentValue, index, array) {
			var element = document.getElementsByClassName(currentValue.className)[0].children[0];
			element.addEventListener("click", function() {
				// TODO make logging event request here - we can look at currentValue to look at what was played
				console.log("Current User:\t" + getCurrentUsername());
				console.log("Current Station:\t" + getCurrentStationId());
				console.log("TRACK EVENT:\t" + currentValue.eventName);
			});
	});
}

bindEventsAfterSplashScreen();

// TODO actually find UUID
function getCurrentStationId() {
	var container = document.getElementsByClassName('stationListItem selected')[0];
	return container.getElementsByClassName('stationNameText')[0].innerHTML.trim();
}

function getCurrentUsername() {
	return document.getElementsByClassName('userName')[0].innerHTML;
}

/* points of concern 
Need to track when participants add a seed 
For this we need a notion of station primary key. Each station has a UUID but i'm unsure if that's accessible from within the DOM. This can likely be found
by looking for links that have the station id as an HTTP param. 

If we can't get the station ID then it is possible to just rely on station name. Although this would be complicated & would likely require modifying
the DOM such that users can't rename a station. Plus if they have multiple stations that's bad.

Also need to code a way for a user to track when a user adds a seed to a station, or possibly removes one as well.
*/
var clickableClassNames = ['thumbDownButton', 'thumbUpButton', 'playButton', 'pauseButton', 'skipButton'];

// chrome will run the script when the page is loading; this gets tricky becuase Pandora loads a splashscreen with a 
// multitutde of async requests. What we can do is periorically probe until the splash screen is gone in the dom via timeout
// polling 

var TIMEOUT_INTERVAL = 500;

function bindEventsAfterSplashScreen() {
	if (document.getElementById("splash").style.display !== 'none') {
		// the splash screen is still visible; try again
		console.log("still loading");
		window.setTimeout(bindEventsAfterSplashScreen, TIMEOUT_INTERVAL);
	}
	else {
		// additional timeout delay just to wait and make sure
		setTimeout(function() {
			clickableClassNames.forEach(function(currentValue, index, array) {
				console.log(currentValue);
			});
		}, TIMEOUT_INTERVAL);
	}
}


bindEventsAfterSplashScreen();

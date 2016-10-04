var clickableClassNames = ['thumbDownButton', 'thumbUpButton', 'playButton', 'pauseButton', 'skipButton'];

// chrome will run the script when the page is loading; this gets tricky becuase Pandora loads a splashscreen with a 
// multitutde of async requests. What we can do is periorically probe until the splash screen is gone in the dom via timeout
// polling 

var TIMEOUT_INTERVAL = 500;

var loadingTime = 0;

function bindEventsAfterSplashScreen() {
	if (document.getElementById("splash").style.display !== 'none') {
		// the splash screen is still visible; try again
		console.log(++loadingTime + ".) Loading Splash Screen");
		window.setTimeout(bindEventsAfterSplashScreen, TIMEOUT_INTERVAL);
	}
	else {
		// additional timeout delay just to wait and make sure
		setTimeout(function() {
			injectListeners();			
		}, TIMEOUT_INTERVAL);
	}
}


function injectListeners() {
	clickableClassNames.forEach(function(currentValue, index, array) {
			var element = document.getElementsByClassName(currentValue)[0].children[0];
			element.onclick = function() {console.log(currentValue + " was clicked");};
	});
}

bindEventsAfterSplashScreen();



// keys can be used on a dictionary to override default tracking methods when calling the track
var KEY_EVENT = "event";
var KEY_STATION_ID = "station_id";
var KEY_STATION_NAME = "station_name";
var KEY_SONG = "song";


// hardcoded values for KEY_EVENT
var EVENT_THUMBS_DOWN_ADDED = "Tumb Down Added";
var EVENT_THUMBS_UP_ADDED = "Thumb Up Added";
var EVENT_THUMBS_DOWN_DELETED = "Thumb Down Deleted";
var EVENT_THUMBS_UP_DELETED = "Thumb Up Deleted";
var EVENT_PLAY = "Play";
var EVENT_PAUSE = "Pause";
var EVENT_SKIP = "Skip";

// these refer to events that can be tracked directky by clicking on a DOM element
var clickableClassNames = [
	{className: 'thumbDownButton', eventName: EVENT_THUMBS_DOWN_ADDED},
	{className: 'thumbUpButton', eventName: EVENT_THUMBS_UP_ADDED},
	{className: 'playButton', eventName: EVENT_PLAY},
	{className: 'pauseButton', eventName: EVENT_PAUSE},
	{className: 'skipButton', eventName: EVENT_SKIP}];


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
				track({KEY_EVENT: currentValue.eventName});
			});
	});
	if (document.location.href.indexOf("pandora.com/station/") !== -1) {
		injectStationDetailListeners();
	}
}

function injectStationDetailListeners() {
	var url = document.location.href.split('/');
	// we need station id from URL since you can view a station's details while playing another station
	var stationId = Number(url[url.length -1]);
	var stationName = $('.hed-1')[0].innerHTML.trim();

	$('.thumb_up_list').find('.deletable').each(function() {
		var el = this;
		el.addEventListener("click", function() {
			var sognContainer = $(el.parentElement.parentElement).find(".col1 a")[0];
			track({
				KEY_EVENT: EVENT_THUMBS_UP_DELETED,
				KEY_STATION_ID: stationId,
				KEY_STATION_NAME: stationName,
				KEY_SONG: {name: sognContainer.innerHTML, href: sognContainer.href}
			});
		});
	});

	$('.thumb_down_list').find('.deletable').each(function(){
		var el = this;
		el.addEventListener("click", function() {
			var sognContainer = $(el.parentElement.parentElement).find(".col1 a")[0];
			track({
				KEY_EVENT: EVENT_THUMBS_DOWN_DELETED,
				KEY_STATION_ID: stationId,
				KEY_STATION_NAME: stationName,
				KEY_SONG: {name: sognContainer.innerHTML, href: sognContainer.href}
			});
		});
	});
}

function track(data) {
	data = data || {};
	console.log("Username:\t" + getCurrentUsername());
	console.log("Station ID:\t" + (data.KEY_STATION_ID || getCurrentStationId()));
	console.log("Song Info:\t" + JSON.stringify((data.KEY_SONG || getSongInfo())));
	console.log("Station Name:\t" + (data.KEY_STATION_NAME || getCurrentStationName()));
	console.log("Event:\t" + (data.KEY_EVENT || "ERROR"));
}

function getCurrentStationId() {
	// ie https://www.pandora.com/station/3333039448775710377/fans
	var url = document.getElementsByClassName('findFans')[0].href;
	var token = '/station/';
	url = url.substring(url.indexOf(token));
	url = url.substring(token.length);
	url = url.substring(0, url.indexOf('/'));
	return Number(url);
}

function getCurrentStationName() {
	var container = document.getElementsByClassName('stationListItem selected')[0];
	return container.getElementsByClassName('stationNameText')[0].innerHTML.trim();
}

function getCurrentUsername() {
	return document.getElementsByClassName('userName')[0].innerHTML;
}


function getSongInfo() {
	var song = $('.songTitle')[0];
	return {
		// song name user sees
		name: song.innerHTML,
		// link to page for song (unique identifier for a track)
		href: song.href
	};
}

/* points of concern 
Need to track when participants add a seed 
For this we need a notion of station primary key. Each station has a UUID but i'm unsure if that's accessible from within the DOM. This can likely be found
by looking for links that have the station id as an HTTP param. 

Also need to code a way for a user to track when a user adds a seed to a station, or possibly removes one as well.

Should track song when click occurs
*/


bindEventsAfterSplashScreen();
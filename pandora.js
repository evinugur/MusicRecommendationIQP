// keys can be used on a dictionary to override default tracking methods when calling the track
var KEY_EVENT = "event";
var KEY_STATION_ID = "station_id";
var KEY_STATION_NAME = "station_name";
var KEY_SONG = "song";
var KEY_SHUFFLE_ON = "shuffle";

// hardcoded values for KEY_EVENT
var EVENT_THUMBS_DOWN_ADDED = "Tumb Down Added";
var EVENT_THUMBS_UP_ADDED 	= "Thumb Up Added";
var EVENT_THUMBS_DOWN_DELETED = "Thumb Down Deleted";
var EVENT_THUMBS_UP_DELETED = "Thumb Up Deleted";
var EVENT_PLAY = "Play";
var EVENT_PAUSE = "Pause";
var EVENT_SKIP = "Skip";
var EVENT_STATION_SELECT = "Station Select";
var EVENT_INITIAL_STATION = "Initial Station";

var VALUE_NO_SONG = {name :"", href: ""};

// these refer to events that can be tracked directky by clicking on a DOM element
// all of these are menu bar buttons
var clickableClassNames = [
	{className: 'playButton', eventName: EVENT_PLAY},
	{className: 'pauseButton', eventName: EVENT_PAUSE},
	{className: 'skipButton', eventName: EVENT_SKIP}];


var IMG_MENUBAR_THUMB_NEUTRAL_TO_UP = '/img/player-controls/btn_up@2x.png';
var IMG_MENUBAR_THUMB_NEUTRAL_TO_DOWN = '/img/player-controls/btn_down@2x.png';

var IMG_HOVER_NEURTAL_TO_UP = '/img/content-area/smallthumbs/btn_up_hover_sm.png';
var IMG_HOVER_UP_TO_NEUTRAL = '/img/content-area/smallthumbs/btn_up_indicator_hover_sm.png';
var IMG_HOVER_NEURTAL_TO_DOWN = '/img/content-area/smallthumbs/btn_down_hover_sm.png';
var IMG_HOVER_DOWN_TO_NEUTRAL = '/img/content-area/smallthumbs/btn_down_indicator_hover_sm.png';

/* chrome will run the script when the page is loading; this gets tricky becuase Pandora loads a splashscreen with a 
multitutde of async requests. What we can do is periorically probe until the splash screen is gone in the dom via timeout
polling */
var TIMEOUT_INTERVAL = 500;

/**
Variables used to detect a change in URL events (listening to HTML5's hashchange as well as a jquery plugin weren't working) so 
instead of figuring out what's going on we will poll and use global variables. 
At URL_POLLING_INVTERVAL if URL_CACHE is incorrect URL_CHANGE_CALLBACK will be called if it isn't null and then will become null.
*/
var URL_POLLING_INTERVAL = 100;
var URL_CACHE = document.location.href;
var URL_CHANGE_CALLBACK = null;

var ANTI_BUBBLE_POLLING_INTERVAL = 100;

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


function getHoverThumbItem(isThumbUpBtn, thumbDiv) {
	var thumbElement = thumbDiv.children[0];
	var style = getComputedStyle(thumbElement);
	var url = style['background-image'];
	if (isThumbUpBtn) {
		if (url.indexOf(IMG_HOVER_NEURTAL_TO_UP) !== -1) console.log(EVENT_THUMBS_UP_ADDED);
		else console.log(EVENT_THUMBS_UP_DELETED);
	} else {
		if (url.indexOf(IMG_HOVER_NEURTAL_TO_DOWN) !== -1) console.log(EVENT_THUMBS_DOWN_ADDED);
		else console.log(EVENT_THUMBS_DOWN_DELETED);
	}
}

function init() {
	var urlPolling = function() {
		if (URL_CACHE !== document.location.href) {
			URL_CACHE = document.location.href;
			if (URL_CHANGE_CALLBACK) {
				URL_CHANGE_CALLBACK();
				URL_CHANGE_CALLBACK = null;
			}
		}
		setTimeout(urlPolling, URL_POLLING_INTERVAL);
	};

	// some dynamic events don't bubble - solution: crudely lobe code many times a second 
	
	var antiEventBubblingPolling = function() {
		var cssTag = "bubble_bound";
		var eventWithNamespace = "click.bubble_thumb";
		$('.thumbUp:not(.' + cssTag + ')').addClass(cssTag).bind(eventWithNamespace, function() {
			console.log("Thumb Up");
			getHoverThumbItem(true, this);
		});
		$('.thumbDown:not(.' + cssTag + ')').addClass(cssTag).bind(eventWithNamespace, function() {
			console.log("Thumb Down");
			getHoverThumbItem(false, this);
		});
		setTimeout(antiEventBubblingPolling, ANTI_BUBBLE_POLLING_INTERVAL)
	};

	urlPolling();
	injectListeners();
	antiEventBubblingPolling();
	recordInitialStationEvent();
}


function injectListeners() {
	clickableClassNames.forEach(function(currentValue, index, array) {
			var element = document.getElementsByClassName(currentValue.className)[0].children[0];
			element.addEventListener("click", function() {
				track({KEY_EVENT: currentValue.eventName});
			});
	});

	$('.thumbUpButton').click(function() {
		if (getComputedStyle(this.children[0])['background-image'].indexOf(IMG_MENUBAR_THUMB_NEUTRAL_TO_UP) !== -1)
			track({KEY_EVENT: EVENT_THUMBS_UP_ADDED});
		else track({KEY_EVENT: EVENT_THUMBS_UP_DELETED});
	});

	$('.thumbDownButton').click(function() {
		if (getComputedStyle(this.children[0])['background-image'].indexOf(IMG_MENUBAR_THUMB_NEUTRAL_TO_DOWN) !== -1)
			track({KEY_EVENT: EVENT_THUMBS_DOWN_ADDED});
		else track({KEY_EVENT: EVENT_THUMBS_DOWN_DELETED});
	});

	// station change event 
	$("#stationList").on("click", ".stationListItem", function() {
		if (this.children[0].id === "shuffleContainer") return; // shuffling is tracked separately
		var newStation = $(this).find('.stationNameText')[0].innerHTML.trim();
		window.URL_CHANGE_CALLBACK = function() {
			track({
				KEY_EVENT: EVENT_STATION_SELECT,
				KEY_STATION_ID: getStationIdFromUrl(window.location.href, "/station/play/"),
				KEY_STATION_NAME: newStation,
				KEY_SONG: VALUE_NO_SONG
			});	
		};
	});

	var url = document.location.href;
	if (url.indexOf("pandora.com/station/") !== -1) 
		if(url.indexOf("/play/") === -1)
			injectStationDetailListeners();
}

function recordInitialStationEvent() {
	window.setTimeout(function() {
		var id = $('.slides.unselectable')[0].children[0].id;
		id = id.substring("stationSlides".length);
		track({
				KEY_EVENT: EVENT_INITIAL_STATION,
				KEY_STATION_ID: id
			});	
	}, 3000);
}

function injectStationDetailListeners() {
	console.log("injecting station detail page listeners");
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
	console.log("Shuffle Enabled:\t" + isShuffledEnabled());
	console.log("Event:\t" + (data.KEY_EVENT || "ERROR"));
	console.log("Date:\t" + new Date().toUTCString());
	var song = (data.KEY_SONG || getSongInfo());
	var payload = {
		username: getCurrentUsername(),
		event: data.KEY_EVENT,
		date: new Date().toISOString(),
		stationId: (data.KEY_STATION_ID || getCurrentStationId()),
		stationName: (data.KEY_STATION_NAME || getCurrentStationName()),
		songName: song.name,
		songHref: song.href,
		shuffleEnabled: isShuffledEnabled()
	};
	$.ajax({
		url: 'https://warm-lake-98113.herokuapp.com/pandora-event',
		type: 'POST',
		data: JSON.stringify(payload),
		contentType : 'application/json',
		success: function() { console.log("Posted"); }
	});
}

// TODO possible broken on shuffle
function getCurrentStationId() {
	// ie https://www.pandora.com/station/3333039448775710377/fans
	return getStationIdFromUrl(document.getElementsByClassName('findFans')[0].href, '/station/')
}

function getStationIdFromUrl(url, token) {
	url = url.substring(url.indexOf(token));
	url = url.substring(token.length);
	url = url.substring(0, url.indexOf('/'));
	return url;
}

// TODO broken on shuffle
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

function isShuffledEnabled() {
	return  $('.stationListItem.selected').find("#shuffleContainer").length > 0;
}

/* 
Also need to code a way for a user to track when a user adds a seed to a station, or possibly removes one as well - this can be done retroactively.
*/

bindEventsAfterSplashScreen();
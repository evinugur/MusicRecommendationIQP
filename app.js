var STORAGE_KEY_USER_ID = "userId";
var STORAGE_KEY_USER_NAME = "name";
var STORAGE_KEY_USER_WPI = "wpiemail";


function getStudyEmail(id) {
	 var str = 'muiqp';
	 if (id < 10) str += 0;
	 str += id + '@hmamail.com'
	 return str;
}

(function() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.event === "tunein_track") {
			var href = request.href;
			var count = request.count;
			chrome.storage.local.get([STORAGE_KEY_USER_ID, STORAGE_KEY_USER_NAME, STORAGE_KEY_USER_WPI], function(result) {
				console.log(result);
				console.log(href);
				console.log(count);
			});
		}
	});

	window.user = null;

	window.addEventListener("message", function(event) {
	  // We only accept messages from ourselves
	  if (event.source != window)
	    return;

	  if (event.data.type && (event.data.type == "FROM_PAGE")) {
	    var tuneinData = event.data.text.split(' ');
	    debugger;
	  }
	}, false);

	chrome.storage.local.get([STORAGE_KEY_USER_ID, STORAGE_KEY_USER_NAME, STORAGE_KEY_USER_WPI], function(result) {
		if (!isNaN(result[STORAGE_KEY_USER_ID])) {
			window.user = {
				id: result[STORAGE_KEY_USER_ID],
				name: result[STORAGE_KEY_USER_NAME],
				wpiEmail: result[STORAGE_KEY_USER_WPI],
				studyEmail: getStudyEmail(result[STORAGE_KEY_USER_ID])
			};
		}
	});

	var url = document.location.href;
	if (url.indexOf("pandora") !== -1) {
		injectScript("pandora.js");
	}
	else if (url.indexOf("tunein") !== -1) {
		injectScript("tunein.js");
	}
})();

function injectScript(src) {
	var script = document.createElement('script');
	script.src = chrome.extension.getURL(src);
	script.onload = function() { this.parentNode.removeChild(this); };
	(document.head || document.documentElement).appendChild(script);
	// if they don't have their settings configured then pop open the page
	chrome.storage.local.get([STORAGE_KEY_USER_ID], function(result) {
		if (!isNaN(result[STORAGE_KEY_USER_ID])) return;
		// tell background script (running sandboxed from web page) that we need to open the registration page
		chrome.runtime.sendMessage({"event": "register"}, function(response) {});
	});
}

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
	window.user = null;
	window.addEventListener("message", function(event) {
	  // We only accept messages from ourselves
	  if (event.source != window)
	    return;

	  if (event.data.type && (event.data.type == "FROM_PAGE")) {
	    var tuneinData = event.data.text.split(' ');
	    var payload = {
	    	date: new Date().toISOString(),
	    	userId: '' + window.user.id,
	    	timeCount: tuneinData[0],
	    	href: tuneinData[1]
	    };
	    $.ajax({
				url: 'https://warm-lake-98113.herokuapp.com/pandora-event/tunein-events',
				type: 'POST',
				data: JSON.stringify(payload),
				contentType : 'application/json',
				success: function() { console.log("Posted"); }
			});
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
		injectScript(["pandora.js"]);
	}
	else if (url.indexOf("tunein") !== -1) {
		injectScript(["tunein.js"]);
	}
})();

function injectScript(scripts) {
	for (var i = 0; i < scripts.length; i++) {
		var script = document.createElement('script');
		script.src = chrome.extension.getURL(scripts[i]);
		script.onload = function() { this.parentNode.removeChild(this); };
		(document.head || document.documentElement).appendChild(script);
	}
	// if they don't have their settings configured then pop open the page
	chrome.storage.local.get([STORAGE_KEY_USER_ID], function(result) {
		if (!isNaN(result[STORAGE_KEY_USER_ID])) return;
		// tell background script (running sandboxed from web page) that we need to open the registration page
		chrome.runtime.sendMessage({"event": "register"}, function(response) {});
	});
}

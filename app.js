

(function() {
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
	var STORAGE_KEY_USER_ID = "userId";
	chrome.storage.local.get(STORAGE_KEY_USER_ID, function(result) {
		debugger; 
		if (!isNaN(result[STORAGE_KEY_USER_ID])) return;
		// tell background script (running sandboxed from web page) that we need to open the registration page
		chrome.runtime.sendMessage({"event": "register"}, function(response) {
			console.log(response.farewell);
		});
	});
}

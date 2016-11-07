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
}

// React when a browser action's icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('background.html')}, function() {
  	
  });
});
(function() {
	var url = document.location.href;
	var src;
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
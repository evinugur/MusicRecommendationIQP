document.addEventListener('DOMContentLoaded', init);
function init() {
	var settingsBtn = document.querySelector("#settingsBtn");
	var discoveryBtn = document.querySelector('#discoveryBtn');
	settingsBtn.addEventListener("click", function() {
		chrome.tabs.create({'url': chrome.extension.getURL('background.html')});
	});


	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var tab = tabs[0];
		if (tab.url.indexOf("tunein.com") === -1 && tab.url.indexOf("pandora.com") === -1) {
			discoveryBtn.disabled = true;
			discoveryBtn.title = "Use this to notify a discovery on pandora or tunein";
		} else {
			discoveryBtn.disabled = false;
			discoveryBtn.title = "Record this track as a discovery";
		}
	});


	discoveryBtn.addEventListener('click', function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  		chrome.tabs.sendMessage(tabs[0].id, {event: "discovery"}, function(response) {});
		});
	});
};


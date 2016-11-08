document.addEventListener('DOMContentLoaded', init);
function init() {
	var settingsBtn = document.querySelector("#settingsBtn");
	var discoveryBtn = document.querySelector('#discoveryBtn');
	settingsBtn.addEventListener("click", function() {
		chrome.tabs.create({'url': chrome.extension.getURL('background.html')});
	});


	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var tab = tabs[0];
		if (tab.url.indexOf("tunein.com/radio") === -1 && tab.url.indexOf("pandora.com") === -1) {
			discoveryBtn.disabled = true;
			return;
		}
		discoveryBtn.disabled = false;
	});



	discoveryBtn.addEventListener('click', function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  		chrome.tabs.sendMessage(tabs[0].id, {event: "discovery"}, function(response) {
		    	console.log(response.farewell);
  		});
		});
	});
};
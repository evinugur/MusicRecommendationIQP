document.addEventListener('DOMContentLoaded', init);
function init() {
	var settingsBtn = document.querySelector("#settingsBtn");
	settingsBtn.addEventListener("click", function() {
		chrome.tabs.create({'url': chrome.extension.getURL('background.html')});
	});
};
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	debugger;
	if (request.event === "register");
		chrome.tabs.create({'url': chrome.extension.getURL('background.html')});
});

window.onload = function() {
		var STORAGE_KEY_USER_REGISTERED = "userRegistered";
		var STORAGE_KEY_TUNEIN = "tuneinEmail";
		document.getElementById('tuneinGetButton').onclick = function() {
			chrome.storage.local.get(STORAGE_KEY_TUNEIN, function(result) {
				console.log(result[STORAGE_KEY_TUNEIN]);
			});
		};
		document.getElementById("tuneinButton").onclick = function() {
			var text = document.getElementById("tuneinEmail").value.trim();
			if (!text) {
				console.log("Invalid!");
				return;
			}
			var payload = {};
			payload[STORAGE_KEY_TUNEIN] = text;
			chrome.storage.local.set(payload, function() {
				console.log("Saving", text);
			});
		};
	};
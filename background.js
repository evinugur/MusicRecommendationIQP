window.onload = function() {
		var STORAGE_KEY_TUNEIN = "tuneinEmail";
		document.getElementById('tuneinGetButton').onclick = function() {
			chrome.storage.local.get(STORAGE_KEY_TUNEIN, function(result) {
				console.log(result[STORAGE_KEY_TUNEIN]);
				debugger;
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
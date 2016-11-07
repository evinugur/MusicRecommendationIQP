window.onload = function() {
		var STORAGE_KEY_TUNEIN = "tuneinEmail";
		document.getElementById("tuneinButton").onclick = function() {
			var text = document.getElementById("tuneinEmail").value.trim();
			if (!text) {
				console.log("Invalid!");
				return;
			}
			chrome.storage.sync.set({STORAGE_KEY_TUNEIN: text}, function() {
				console.log("Saving", text);
			});
		};
	};
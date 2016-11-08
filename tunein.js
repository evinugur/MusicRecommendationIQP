window.onload = function() {
	var counter = 1;
	var nextTimeout = null;
	var URL_POLLING_INTERVAL = 100;
	var URL_CACHE = null;
	var URL_CHANGE_CALLBACK = null;
	var track = function() {
		var url = document.location.href;
		if (url.indexOf("/radio") === -1) return;
		window.postMessage({ type: "FROM_PAGE", text: counter + ' ' + url }, "*");
		counter++;
		nextTimeout = setTimeout(track, 1000 * 60 * 5);
	};
	var urlPolling = function() {
		if (URL_CACHE !== document.location.href) {
			URL_CACHE = document.location.href;
			counter = 1;
			if (nextTimeout)  clearTimeout(nextTimeout);
			track();
		}
		setTimeout(urlPolling, URL_POLLING_INTERVAL);
	}
	urlPolling();
};
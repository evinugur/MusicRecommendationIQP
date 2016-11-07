window.onload = function() {
	var url = document.location.href;
	if (url.indexOf("/radio") === -1) return;
	var counter = 1;
	var track = function() {
		window.postMessage({ type: "FROM_PAGE", text: counter + ' ' + url }, "*");
		counter++;
		setTimeout(track, 1000 * 60 * 5);
	};
	track();	
};
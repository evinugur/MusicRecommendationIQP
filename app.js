var script = document.createElement('script');
script.src = chrome.extension.getURL('pandora.js');
script.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(script);

/**
The manifest gives us full access to run app.js (and any of the web-accessible resources defiend in the manifest such as pandora.js) anywhere 
on the Pandora domain. 

In order to track events that aren't on the main screen, such as when a user removes a seed from a station, we'd possibly want to analyze
the URL scheme in this file and conditionally inject different content scripts and/or injecting multiple scripts
*/
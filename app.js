var script = document.createElement('script');
script.src = chrome.extension.getURL('pandora.js');
script.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(script);
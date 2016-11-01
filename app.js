(function() {
var script = document.createElement('script');
var url = document.location.href;
var src;
if (url.indexOf("pandora") !== -1) src = "pandora.js";
else if (url.indexOf("tunein") !== -1) src = "tunein.js";
if (!src) return;
script.src = chrome.extension.getURL('pandora.js');
script.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(script);})();
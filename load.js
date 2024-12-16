var globalData;
(function () {
"use strict";

var scripts = document.getElementsByTagName('script'), i, url, data;

for (i = 0; i < scripts.length; i++) {
	url = scripts[i].src || url;
	data = scripts[i].textContent || data;
}

globalData = JSON.parse(data);

document.body.innerHTML = [
	'<div id="list"></div>',
	'<div id="panel"><div id="button-bar">',
	'<button id="button-edit">✎</button>',
	'<button id="button-filter">🔍︎</button>',
	'<button id="button-export">⤓</button>',
	'<button id="button-hide-info">→</button>',
	'<button id="button-show-info">←</button>',
	'</div><div id="info"></div></div>',
	'<div id="popup" hidden></div>'
].join('\n');
[
	'res-show/album.css',
	'res-show/util.js',
	'res-show/l10n.js',
	'res-show/format.js',
	'res-show/edit.js',
	'res-show/filter.js',
	'res-show/album.js'
].forEach(function (src) {
	var node;
	src = url.replace('load.js', src);
	if (src.slice(-4) === '.css') {
		node = document.createElement('link');
		node.rel = 'stylesheet';
		node.href = src;
	} else if (src.slice(-3) === '.js') {
		node = document.createElement('script');
		node.async = false;
		node.defer = true;
		node.src = src;
	} else {
		throw new Error('Unknown type');
	}
	document.head.appendChild(node);
});
})();
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
	'<button id="button-edit"><svg width="30" height="30" viewBox="0 0 30 30">',
		'<path d="M 4,26 L 8,18 L 21.5,5.5 L 26,11 L 13,23 z" /><path d="M 4,26 L 6,22 L 8.5,24.5 z M 20,7 L 21.5,5.5 L 26,11 L 24,12 z" fill="currentcolor" />',
	'</svg></button>',
	'<button id="button-filter"><svg width="30" height="30" viewBox="0 0 30 30">',
		'<circle cx="9" cy="9" r="6" /><path d="M 14,14 L 18.5,16 L 25,23 L 23,25 L 16,18.5 z" fill="currentcolor" />',
	'</svg></button>',
	'<button id="button-export"><svg width="30" height="30" viewBox="0 0 30 30">',
		'<path d="M 15,7.5 L 15,19 M 11,15 L 15,19 L 19,15 M 7.5,22.5 L 22.5,22.5" />',
	'</svg></button>',
	'<button id="button-hide-info"><svg width="30" height="30" viewBox="0 0 30 30">',
		'<path d="M 4,11 L 4,4 L 11,4 M 19,4 L 26,4 L 26,11 M 26,19 L 26,26 L 19,26 M 11,26 L 4,26 L 4,19 M 4,4 L 13,13 M 26,26 L 17,17 M 4,26 L 13,17 M 26,4 L 17,13" />',
	'</svg></button>',
	'<button id="button-show-info"><svg width="30" height="30" viewBox="0 0 30 30">',
		'<path d="M 13,5 L 13,13 L 5,13 M 25,13 L 17,13 L 17,5 M 17,25 L 17,17 L 25,17 M 5,17 L 13,17 L 13,25 M 4,4 L 13,13 M 26,26 L 17,17 M 4,26 L 13,17 M 26,4 L 17,13" />',
	'</svg></button>',
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
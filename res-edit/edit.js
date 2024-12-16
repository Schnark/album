(function () {
"use strict";

var data;

function getData () {
	var data = /^[^#]*[&?]data=([^&#]*)/.exec(location.href);
	if (data) {
		try {
			return JSON.parse(decodeURIComponent(data[1].replace(/\+/g, '%20')));
		} catch (e) {
		}
	}
	return {
		lang: '<lang>',
		title: '<title>',
		content: []
	};
}

function readData (prefix) {
	return {
		type: document.getElementById(prefix + 'type').value,
		path: document.getElementById(prefix + 'path').value,
		poster: document.getElementById(prefix + 'poster').value,
		thumb: document.getElementById(prefix + 'thumb').value,
		w: Number(document.getElementById(prefix + 'w').value),
		h: Number(document.getElementById(prefix + 'h').value),
		dur: Number(document.getElementById(prefix + 'dur').value),
		size: Number(document.getElementById(prefix + 'size').value),
		title: document.getElementById(prefix + 'title').value,
		desc: document.getElementById(prefix + 'desc').value,
		date: document.getElementById(prefix + 'date').value,
		place: document.getElementById(prefix + 'place').value,
		author: document.getElementById(prefix + 'author').value,
		camera: document.getElementById(prefix + 'camera').value,
		stars: Number(document.getElementById(prefix + 'stars').value),
		tags: document.getElementById(prefix + 'tags').value.split('\n').filter(function (tag) {
			return tag;
		})
	};
}

function writeData (prefix, data) {
	document.getElementById(prefix + 'type').value = data.type || '';
	document.getElementById(prefix + 'path').value = data.path || '';
	document.getElementById(prefix + 'poster').value = data.poster || '';
	document.getElementById(prefix + 'thumb').value = data.thumb || '';
	document.getElementById(prefix + 'w').value = data.w || '';
	document.getElementById(prefix + 'h').value = data.h || '';
	document.getElementById(prefix + 'dur').value = data.dur || '';
	document.getElementById(prefix + 'size').value = data.size || '';
	document.getElementById(prefix + 'title').value = data.title || '';
	document.getElementById(prefix + 'desc').value = data.desc || '';
	document.getElementById(prefix + 'date').value = data.date || '';
	document.getElementById(prefix + 'place').value = data.place || '';
	document.getElementById(prefix + 'author').value = data.author || '';
	document.getElementById(prefix + 'camera').value = data.camera || '';
	document.getElementById(prefix + 'stars').value = data.stars ? data.stars : '';
	document.getElementById(prefix + 'tags').value = data.tags ? data.tags.join('\n') : '';
}

function getType (type, name) {
	type = type.replace(/\/.*/, '');
	if (['image', 'video', 'audio'].indexOf(type) > -1) {
		return type;
	}
	switch (name.toLowerCase().replace(/.*\./, '')) {
	case 'jpg':
	case 'jpeg':
	case 'png':
		return 'image';
	default:
		return 'other';
	}
}

function formatDate (date) {
	function pad (n) {
		return n < 10 ? '0' + String(n) : String(n);
	}

	function formatTimezone (diff) {
		return (diff <= 0 ? '+' : '-') + pad(Math.floor(Math.abs(diff) / 60)) + ':' + pad(Math.abs(diff) % 60);
	}

	if (isNaN(Number(date))) {
		return '';
	}

	return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' +
		pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) +
		formatTimezone(date.getTimezoneOffset());
}

function getThumb (file, callback) {
	var THUMB_SIZE = 256,
		url = URL.createObjectURL(file),
		img = new Image();
	img.onload = function () {
		var canvas = document.createElement('canvas'), w, h, s;
		s = Math.min(1, THUMB_SIZE / img.width, THUMB_SIZE / img.height);
		w = Math.round(s * img.width);
		h = Math.round(s * img.height);
		canvas.width = w;
		canvas.height = h;
		canvas.getContext('2d').drawImage(img, 0, 0, w, h);
		URL.revokeObjectURL(url);
		callback(canvas.toDataURL('image/jpeg', 0.8), img.width, img.height);
	};
	img.onerror = function () {
		callback('');
	};
	img.src = url;
}

function dataFromFile (file, defaultData, override) {
	var data, key;
	data = {
		type: getType(file.type || '', file.name),
		path: (defaultData.path ? defaultData.path + '/' : '') + file.name,
		poster: '',
		thumb: '',
		w: '',
		h: '',
		dur: '',
		size: file.size,
		title: defaultData.title,
		desc: defaultData.desc,
		date: defaultData.date || formatDate(file.lastModifiedDate || new Date(file.lastModified)),
		place: defaultData.place,
		author: defaultData.author,
		camera: defaultData.camera,
		stars: defaultData.stars,
		tags: defaultData.tags
	};
	if (override[file.name]) {
		for (key in override[file.name]) {
			data[key] = override[file.name][key];
		}
	}
	return data;
}

function addFromFiles (files, ignore, defaultData, override, callback) {
	var oldLength = data.content.length, i = 0;

	function addNext () {
		var item;
		if (i === files.length) {
			callback(data.content.length - oldLength);
		}
		item = dataFromFile(files[i], defaultData, override);
		if (
			!ignore ||
			!data.content.some(function (el) {
				return el.path === item.path;
			})
		) {
			if (item.type === 'image') {
				getThumb(files[i], function (thumb, w, h) {
					item.thumb = thumb;
					item.w = w;
					item.h = h;
					data.content.push(item);
					i++;
					addNext();
				});
			} else {
				data.content.push(item);
				i++;
				addNext();
			}
		} else {
			i++;
			addNext();
		}
	}

	addNext();
}

var addInteractiveData;

function addInteractiveAdd () {
	var item = readData('file-single-');
	data.content.push(item);
	addInteractiveData.added++;
}

function addInteractiveNext () {
	var file, item;
	addInteractiveData.i++;
	if (addInteractiveData.i === addInteractiveData.files.length) {
		addInteractiveFinish();
		return;
	}
	file = addInteractiveData.files[addInteractiveData.i];
	item = dataFromFile(file, addInteractiveData.defaultData, addInteractiveData.override);
	if (
		addInteractiveData.ignore &&
		data.content.some(function (el) {
			return el.path === item.path;
		})
	) {
		addInteractiveNext();
		return;
	}
	writeData('file-single-', item);
	document.getElementById('file-single-thumb-img').src = '';
	if (item.type === 'image') {
		getThumb(file, function (thumb, w, h) {
			document.getElementById('file-single-thumb-img').src = thumb;
			document.getElementById('file-single-thumb').value = thumb;
			document.getElementById('file-single-w').value = w;
			document.getElementById('file-single-h').value = h;
		});
	}
}

function addInteractiveFinish () {
	document.getElementById('fieldset-add').hidden = false;
	document.getElementById('fieldset-single').hidden = true;
	addInteractiveData.callback(addInteractiveData.added);
}

function addInteractive (files, ignore, defaultData, override, callback) {
	document.getElementById('fieldset-add').hidden = true;
	document.getElementById('fieldset-single').hidden = false;
	addInteractiveData = {
		files: files,
		ignore: ignore,
		defaultData: defaultData,
		override: override,
		callback: callback,
		i: -1,
		added: 0
	};
	addInteractiveNext();
}

function updateOutput () {
	document.getElementById('output').textContent = JSON.stringify(data, function (key, val) {
		if (Array.isArray(val) && val.length === 0) {
			return;
		}
		if (!val) {
			return;
		}
		return val;
	}, '\t');
}

function getOverride () {
	var data = document.getElementById('file-default-override').value || '{}';
	try {
		data = JSON.parse(data);
	} catch (e) {
		alert('Invalid override data: ' + e);
		data = {};
	}
	return data;
}

function init () {
	data = getData();
	document.getElementById('file-add-all').addEventListener('click', function () {
		addFromFiles(
			document.getElementById('file-input').files,
			document.getElementById('file-ignore').checked,
			readData('file-default-'),
			getOverride(),
			function (c) {
				updateOutput();
				alert('Added ' + c + ' entries');
			}
		);
	});
	document.getElementById('file-add-interactive').addEventListener('click', function () {
		addInteractive(
			document.getElementById('file-input').files,
			document.getElementById('file-ignore').checked,
			readData('file-default-'),
			getOverride(),
			function (c) {
				updateOutput();
				alert('Added ' + c + ' entries');
			}
		);
	});
	document.getElementById('file-add-single').addEventListener('click', function () {
		addInteractiveAdd();
		addInteractiveNext();
	});
	document.getElementById('file-add-skip').addEventListener('click', function () {
		addInteractiveNext();
	});
	document.getElementById('file-add-finish').addEventListener('click', function () {
		addInteractiveFinish();
	});
}

init();

})();
/*global edit: true*/
/*global util, l10n*/
/*global URL*/
edit =
(function () {
"use strict";

var callback;

function buildMainInputs () {
	return [
		'<p><label>' + l10n.get('editTitle') + '<input name="title"></label></p>',
		'<p><label>' + l10n.get('editDesc') + '<br><textarea name="desc"></textarea></label></p>',
		'<p><label>' + l10n.get('editDate') + '<input name="date"></label></p>',
		'<p><label>' + l10n.get('editPlace') + '<input name="place"></label></p>',
		'<p><label>' + l10n.get('editAuthor') + '<input name="author"></label></p>',
		'<p><label>' + l10n.get('editCamera') + '<input name="camera"></label></p>',
		'<p><label>' + l10n.get('editStars') + '<input name="stars" type="number" min="1" max="5"></label></p>',
		'<p><label>' + l10n.get('editTags') + '<br><textarea name="tags"></textarea></label></p>'
	].join('\n');
}

function buildForm () {
	return [
		'<form>',
		'<h2>' + l10n.get('editHead') + '</h2>',
		buildMainInputs(),
		'<p>',
		'<button>' + l10n.get('editApply') + '</button>',
		'<button data-button="cancel-edit" type="button">' + l10n.get('editCancel') + '</button>',
		'</p>',
		'</form>'
	].join('\n');
}

function initPopup () {
	var div = util.popup.init('edit', buildForm()),
		form = div.getElementsByTagName('form')[0];

	function onCancel () {
		callback('cancel');
	}
	function onSubmit (e) {
		e.preventDefault();
		callback('edit');
	}

	form.addEventListener('keydown', function (e) {
		e.stopPropagation();
		if (util.getKey(e) === 'Escape') {
			onCancel();
		}
	});
	form.querySelector('[data-button="cancel-edit"]').addEventListener('click', onCancel);
	form.addEventListener('submit', onSubmit);
	return div;
}

function openPopup (item, cb) {
	var div;
	callback = cb;
	div = util.popup.show('edit', initPopup);
	div.getElementsByTagName('input')[0].focus();
	util.fillForm(div.getElementsByTagName('form')[0], item);
}

function closePopup () {
	var div = util.popup.hide(),
		form = div.getElementsByTagName('form')[0],
		data = util.serializeForm(form);
	data.tags = data.tags.split('\n').filter(function (tag) {
		return tag;
	});
	return data;
}

function buildAddForm () {
	return [
		'<form>',
		'<h2>' + l10n.get('addHead') + '</h2>',
		'<p><label>' + l10n.get('addType') + '<select name="type">',
		'<option value="files">' + l10n.get('addTypeFiles') + '</option>',
		'<option value="title">' + l10n.get('addTypeTitle') + '</option>',
		'<option value="title-3">' + l10n.get('addTypeTitle3') + '</option>',
		'<option value="title-4">' + l10n.get('addTypeTitle4') + '</option>',
		'<option value="title-5">' + l10n.get('addTypeTitle5') + '</option>',
		'<option value="separator">' + l10n.get('addTypeSeparator') + '</option>',
		'<option value="folder">' + l10n.get('addTypeFolder') + '</option>',
		'</select></label></p>',
		'<p><label>' + l10n.get('addFiles') + '<input name="files" type="file" multiple></label></p>',
		buildMainInputs(),
		'<p>',
		'<button>' + l10n.get('addApply') + '</button>',
		'<button data-button="cancel-edit" type="button">' + l10n.get('addCancel') + '</button>',
		'</p>',
		'</form>'
	].join('\n');
}

function initWaitPopup () {
	return util.popup.init('wait', '<p>' + l10n.get('addWait') + '</p>');
}

function openWaitPopup () {
	util.popup.show('wait', initWaitPopup);
}

function closeWaitPopup () {
	util.popup.hide();
}

function initAddPopup () {
	var div = util.popup.init('add', buildAddForm()),
		form = div.getElementsByTagName('form')[0];

	function onTypeChange () {
		var type = form.querySelector('[name="type"]').value;
		form.querySelector('[name="files"]').disabled = type !== 'files';
		form.querySelector('[name="title"]').disabled = type === 'separator';
		form.querySelector('[name="desc"]').disabled = type === 'separator';
		form.querySelector('[name="date"]').disabled = type === 'separator';
		form.querySelector('[name="place"]').disabled = type === 'separator';
		form.querySelector('[name="author"]').disabled = type === 'separator';
		form.querySelector('[name="camera"]').disabled = type === 'separator';
		form.querySelector('[name="stars"]').disabled = type === 'separator';
		form.querySelector('[name="tags"]').disabled = type === 'separator';
	}
	function onCancel () {
		callback('cancel');
	}
	function onSubmit (e) {
		e.preventDefault();
		callback('add');
	}

	form.addEventListener('keydown', function (e) {
		e.stopPropagation();
		if (util.getKey(e) === 'Escape') {
			onCancel();
		}
	});
	form.querySelector('[name="type"]').addEventListener('change', onTypeChange);
	form.querySelector('[data-button="cancel-edit"]').addEventListener('click', onCancel);
	form.addEventListener('submit', onSubmit);
	return div;
}

function openAddPopup (cb) {
	var div;
	callback = cb;
	div = util.popup.show('add', initAddPopup);
	div.getElementsByTagName('select')[0].focus();
}

function normalizeData (data) {
	var result = {};
	function add (key) {
		if (data[key]) {
			result[key] = data[key];
		}
	}
	add('type');
	add('level');
	add('path');
	add('poster');
	add('thumb');
	add('w');
	add('h');
	add('dur');
	add('size');
	add('title');
	add('desc');
	add('date');
	add('place');
	add('author');
	add('camera');
	add('stars');
	if (data.tags && data.tags.length) {
		result.tags = data.tags;
	}
	add('content');
	return result;
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

function getSizeAndThumb (file, callback) {
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
		callback('', 0, 0);
	};
	img.src = url;
}

function dataFromFile (file, defaultData, callback) {
	var data = {
		type: getType(file.type || '', file.name),
		path: file.name,
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
	if (data.type === 'image') {
		getSizeAndThumb(file, function (thumb, w, h) {
			data.thumb = thumb;
			data.w = w;
			data.h = h;
			callback(data);
		});
	} else {
		callback(data);
	}
}

function dataFromFiles (files, defaultData, callback) {
	var result = [];
	function next () {
		if (result.length === files.length) {
			callback(result);
		} else {
			dataFromFile(files[result.length], defaultData, function (data) {
				result.push(normalizeData(data));
				next();
			});
		}
	}
	next();
}

function closeAddPopup (callback) {
	var div = util.popup.hide(),
		form, data;
	if (!callback) {
		return;
	}
	form = div.getElementsByTagName('form')[0];
	data = util.serializeForm(form);
	data.tags = data.tags.split('\n').filter(function (tag) {
		return tag;
	});
	switch (data.type) {
	case 'files':
		openWaitPopup();
		dataFromFiles(data.files, data, function (result) {
			closeWaitPopup();
			callback(result);
		});
		return;
	case 'title-3':
	case 'title-4':
	case 'title-5':
		data.level = Number(data.type.slice(-1));
		data.type = 'title';
		break;
	case 'separator':
		data = {type: 'separator'};
		break;
	case 'folder':
		data.content = [];
		break;
	}
	callback([normalizeData(data)]);
}

function buildExportForm () {
	return [
		'<form>',
		'<h2>' + l10n.get('exportHead') + '</h2>',
		'<p><label>' + l10n.get('exportData') + '<br><textarea readonly wrap="off" style="height: 30em;"></textarea></p>',
		'<p><button>' + l10n.get('exportDone') + '</button></p>',
		'</form>',
		'<p><a target="_blank">' + l10n.get('exportEdit') + '</a></p>'
	].join('\n');
}

function initExportPopup () {
	var div = util.popup.init('edit', buildExportForm()),
		form = div.getElementsByTagName('form')[0];

	function onSubmit (e) {
		e.preventDefault();
		callback();
	}

	form.addEventListener('keydown', function (e) {
		e.stopPropagation();
		if (util.getKey(e) === 'Escape') {
			callback();
		}
	});
	form.addEventListener('submit', onSubmit);
	return div;
}

function openExportPopup (data, cb) {
	var div, textarea, path;
	callback = cb;
	div = util.popup.show('export', initExportPopup);
	textarea = div.getElementsByTagName('textarea')[0];
	data = JSON.stringify(data, null, '\t');
	textarea.value = data;
	textarea.select();
	path = document.getElementsByTagName('link')[0].href.replace('res-show/album.css', 'edit.html');
	div.getElementsByTagName('a')[0].href = path + '?data=' + encodeURIComponent(data);
}

function closeExportPopup () {
	var div = util.popup.hide();
	div.getElementsByTagName('textarea')[0].value = '';
}

return {
	openPopup: openPopup,
	closePopup: closePopup,
	openAddPopup: openAddPopup,
	closeAddPopup: closeAddPopup,
	openExportPopup: openExportPopup,
	closeExportPopup: closeExportPopup
};
})();
/*global util: true*/
util =
(function () {
"use strict";

var popup = document.getElementById('popup'), currentPopupDiv;

function initPopup (type, html) {
	var div;
	div = document.createElement('div');
	div.dataset.popup = type;
	div.innerHTML = html;
	div.style.display = 'none';
	popup.appendChild(div);
	return div;
}

function destroyPopup (type) {
	var div = popup.querySelector('[data-popup="' + type + '"]');
	if (div) {
		popup.removeChild(div);
	}
}

function showPopup (type, init) {
	var div = popup.querySelector('[data-popup="' + type + '"]');
	if (!div) {
		div = init();
	}
	div.style.display = '';
	currentPopupDiv = div;
	popup.hidden = false;
	return div;
}

function hidePopup () {
	var focus;
	focus = currentPopupDiv.querySelector(':focus');
	if (focus) {
		focus.blur();
	}
	currentPopupDiv.style.display = 'none';
	popup.hidden = true;
	return currentPopupDiv;
}

function escapeHtml (str) {
	return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
		.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function serializeForm (form) {
	var data = {}, elements = form.querySelectorAll('[name]'), i;

	function getValue (element) {
		var value, options, i;
		if (element.type === 'file') {
			return element.files;
		}
		if (element.type === 'select-multiple') {
			value = [];
			options = element.getElementsByTagName('option');
			for (i = 0; i < options.length; i++) {
				if (options[i].selected) {
					value.push(options[i].value);
				}
			}
			return value;
		}
		if (element.type === 'checkbox') {
			return element.checked;
		}
		return element.value.trim();
	}

	for (i = 0; i < elements.length; i++) {
		data[elements[i].name] = getValue(elements[i]);
	}
	return data;
}

function fillForm (form, data) {
	var elements = form.querySelectorAll('[name]'), i;

	function setValue (element, value) {
		var options, i;
		if (element.type === 'select-multiple') {
			options = element.getElementsByTagName('option');
			for (i = 0; i < options.length; i++) {
				options[i].selected = ((value || []).indexOf(options[i].value) > -1);
			}
		} else if (element.type === 'checkbox') {
			element.checked = !!value;
		} else {
			element.value = Array.isArray(value) ? (value.join('\n') + '\n') : (value || '');
		}
	}

	for (i = 0; i < elements.length; i++) {
		setValue(elements[i], data[elements[i].name]);
	}
}

function getKey (e) {
	if (e.key && e.key !== 'Unidentified') {
		return {
			Esc: 'Escape',
			Left: 'ArrowLeft',
			Up: 'ArrowUp',
			Right: 'ArrowRight',
			Down: 'ArrowDown'
		}[e.key] || e.key;
	}
	return {
		13: 'Enter',
		27: 'Escape',
		37: 'ArrowLeft',
		38: 'ArrowUp',
		39: 'ArrowRight',
		40: 'ArrowDown',
		113: 'F2',
		114: 'F3',
		115: 'F4',
		116: 'F5'
	}[e.keyCode] || 'Unidentified';
}

function buildPath (base, path) {
	var full;
	if (path.slice(0, 5) === 'data:') {
		return path;
	}
	full = base + path;
	if (('/' + full + '/').indexOf('/../') > -1) {
		throw new Error('No ../ allowed in paths');
	}
	return full;
}

return {
	popup: {
		init: initPopup,
		destroy: destroyPopup,
		show: showPopup,
		hide: hidePopup
	},
	escapeHtml: escapeHtml,
	serializeForm: serializeForm,
	fillForm: fillForm,
	getKey: getKey,
	buildPath: buildPath
};
})();
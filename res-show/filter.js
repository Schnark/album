/*global filter: true*/
/*global util, l10n*/
filter =
(function () {
"use strict";

var currentFilter, callback;

function resetFilter () {
	currentFilter = {
		type: ['image', 'video', 'audio', 'other', 'title', 'separator', 'folder'],
		search: '',
		minDate: '',
		maxDate: '',
		place: [],
		author: [],
		camera: [],
		minStars: 0,
		maxStars: 0,
		allTags: [],
		anyTags: [],
		noneTags: []
	};
}

function inSet (needle, haystack) {
	return haystack.length === 0 || haystack.indexOf(needle) > -1;
}

function inString (needle, haystack) {
	return haystack.toLowerCase().indexOf(needle.toLowerCase()) > -1;
}

function inDateRange (val, min, max) {
	return min <= val.slice(0, min.length) && val.slice(0, max.length) <= max;
}

function inRange (val, min, max) {
	if (min) {
		if (!val || val < min) {
			return false;
		}
	}
	if (max) {
		if (!val || val > max) {
			return false;
		}
	}
	return true;
}

function testTags (tags, all, any, none) {
	var i;
	for (i = 0; i < all.length; i++) {
		if (tags.indexOf(all[i]) === -1) {
			return false;
		}
	}
	for (i = 0; i < tags.length; i++) {
		if (none.indexOf(tags[i]) > -1) {
			return false;
		}
	}
	if (!any.length) {
		return true;
	}
	for (i = 0; i < tags.length; i++) {
		if (any.indexOf(tags[i]) > -1) {
			return true;
		}
	}
	return false;
}

function testFilter (item) {
	var i;
	if (item.type === 'folder') {
		for (i = 0; i < item.content.length; i++) {
			if (testFilter(item.content[i])) {
				return true;
			}
		}
	}
	if (!inSet(item.type, currentFilter.type)) {
		return false;
	}
	if (
		!inString(
			currentFilter.search,
			(item.title || '') + '\n' +
			(item.desc || '') + '\n' +
			Object.keys(item.annotations || {}).join('\n')
		)
	) {
		return false;
	}
	if (!inDateRange(item.date || '', currentFilter.minDate, currentFilter.maxDate)) {
		return false;
	}
	if (!inSet(item.place || '', currentFilter.place)) {
		return false;
	}
	if (!inSet(item.author || '', currentFilter.author)) {
		return false;
	}
	if (!inSet(item.camera || '', currentFilter.camera)) {
		return false;
	}
	if (!inRange(item.stars, currentFilter.minStars, currentFilter.maxStars)) {
		return false;
	}
	//TODO more?
	return testTags(item.tags || [], currentFilter.allTags, currentFilter.anyTags, currentFilter.noneTags);
}

function buildForm (data) {
	var usedValues = {
		type: [],
		text: false,
		date: false,
		place: [],
		author: [],
		camera: [],
		stars: false,
		tags: []
	}, i, typeInputs;

	function addUsedValues (item) {
		var i;
		if (usedValues.type.indexOf(item.type) === -1) {
			usedValues.type.push(item.type);
		}
		if (item.title || item.desc || item.annotations) {
			usedValues.text = true;
		}
		if (item.date) {
			usedValues.date = true;
		}
		if (usedValues.place.indexOf(item.place || '') === -1) {
			usedValues.place.push(item.place || '');
		}
		if (usedValues.author.indexOf(item.author || '') === -1) {
			usedValues.author.push(item.author || '');
		}
		if (usedValues.camera.indexOf(item.camera || '') === -1) {
			usedValues.camera.push(item.camera || '');
		}
		if (item.stars) {
			usedValues.stars = true;
		}
		if (item.tags) {
			for (i = 0; i < item.tags.length; i++) {
				if (usedValues.tags.indexOf(item.tags[i]) === -1) {
					usedValues.tags.push(item.tags[i]);
				}
			}
		}
		if (item.type === 'folder') {
			for (i = 0; i < item.content.length; i++) {
				addUsedValues(item.content[i]);
			}
		}
	}

	function typeInput (name, label) {
		return usedValues.type.indexOf(name) > -1 ?
			'<label><input type="checkbox" checked name="' + name + '"> ' + label + '</label>' :
			'';
	}

	function listInput (name, label, values) {
		return '<label>' + label + '<br><select multiple name="' + name + '">' + values.sort().map(function (value) {
			if (!value) {
				return '<option value="">' + l10n.get('filterNone') + '</option>';
			}
			return '<option>' + util.escapeHtml(value) + '</option>';
		}).join('') + '</select></label>';
	}

	for (i = 0; i < data.content.length; i++) {
		addUsedValues(data.content[i]);
	}

	typeInputs = [
		typeInput('image', l10n.get('filterTypeImage')),
		typeInput('video', l10n.get('filterTypeVideo')),
		typeInput('audio', l10n.get('filterTypeAudio')),
		typeInput('other', l10n.get('filterTypeOther')),
		typeInput('title', l10n.get('filterTypeTitle')),
		typeInput('separator', l10n.get('filterTypeSeparator')),
		typeInput('folder', l10n.get('filterTypeFolder'))
	].filter(function (input) {
		return input;
	});

	return [
		'<form>',
		'<h2>' + l10n.get('filterHead') + '</h2>',
		//type
		typeInputs.length > 1 ? '<p>' + l10n.get('filterType') + typeInputs.join('\n') + '</p>' : '',
		//search
		usedValues.text ? '<p><label>' + l10n.get('filterSearch') + '<input name="search"></p>' : '',
		//date
		usedValues.date ? '<p><label>' + l10n.get('filterMinDate') + '<input name="min-date"></label>\n' +
		'<label>' + l10n.get('filterMaxDate') + '<input name="max-date"></label></p>' : '',
		//place
		usedValues.place.length > 1 ? '<p>' + listInput('place', l10n.get('filterPlace'), usedValues.place) + '</p>' : '',
		//author
		usedValues.author.length > 1 ? '<p>' + listInput('author', l10n.get('filterAuthor'), usedValues.author) + '</p>' : '',
		//camera
		usedValues.camera.length > 1 ? '<p>' + listInput('camera', l10n.get('filterCamera'), usedValues.camera) + '</p>' : '',
		//stars
		usedValues.stars ? '<p><label>' + l10n.get('filterMinStars') + '<input name="min-stars"></label>\n' +
		'<label>' + l10n.get('filterMaxStars') + '<input name="max-stars"></label></p>' : '',
		//tags
		usedValues.tags.length ? '<p>' + listInput('all-tags', l10n.get('filterAllTags'), usedValues.tags) + '</p>' +
		'<p>' + listInput('any-tags', l10n.get('filterAnyTags'), usedValues.tags) + '</p>' +
		'<p>' + listInput('none-tags', l10n.get('filterNoneTags'), usedValues.tags) + '</p>' : '',
		'<p>',
		'<button>' + l10n.get('filterApply') + '</button>',
		'<button data-button="reset-filter" type="button">' + l10n.get('filterReset') + '</button>',
		'<button data-button="cancel-filter" type="button">' + l10n.get('filterCancel') + '</button>',
		'</p>',
		'</form>'
	].join('\n');
}

function currentFilterFromForm (form) {
	var data = util.serializeForm(form);
	currentFilter = {
		type: [],
		search: data.search || '',
		minDate: data['min-date'] || '',
		maxDate: data['max-date'] || '',
		place: data.place || [],
		author: data.author || [],
		camera: data.camera || [],
		minStars: Number(data['min-stars'] || '0'),
		maxStars: Number(data['max-stars'] || '0'),
		allTags: data['all-tags'] || [],
		anyTags: data['any-tags'] || [],
		noneTags: data['none-tags'] || []
	};
	if (data.image) {
		currentFilter.type.push('image');
	}
	if (data.video) {
		currentFilter.type.push('video');
	}
	if (data.audio) {
		currentFilter.type.push('audio');
	}
	if (data.other) {
		currentFilter.type.push('other');
	}
	if (data.title) {
		currentFilter.type.push('title');
	}
	if (data.separator) {
		currentFilter.type.push('separator');
	}
	if (data.folder) {
		currentFilter.type.push('folder');
	}
}

function formDataFromCurrentFilter () {
	return {
		image: currentFilter.type.indexOf('image') > -1,
		video: currentFilter.type.indexOf('video') > -1,
		audio: currentFilter.type.indexOf('audio') > -1,
		other: currentFilter.type.indexOf('other') > -1,
		title: currentFilter.type.indexOf('title') > -1,
		separator: currentFilter.type.indexOf('separator') > -1,
		folder: currentFilter.type.indexOf('folder') > -1,
		search: currentFilter.search,
		'min-date': currentFilter.minDate,
		'max-date': currentFilter.maxDate,
		place: currentFilter.place,
		author: currentFilter.author,
		camera: currentFilter.camera,
		'min-stars': String(currentFilter.minStars || ''),
		'max-stars': String(currentFilter.maxStars || ''),
		'all-tags': currentFilter.allTags,
		'any-tags': currentFilter.anyTags,
		'none-tags': currentFilter.noneTags
	};
}

function initPopup (data) {
	var div = util.popup.init('filter', buildForm(data)),
		form = div.getElementsByTagName('form')[0];

	function onReset () {
		callback('reset');
	}
	function onCancel () {
		callback('cancel');
	}
	function onSubmit (e) {
		e.preventDefault();
		callback('apply');
	}

	form.addEventListener('keydown', function (e) {
		e.stopPropagation();
		if (util.getKey(e) === 'Escape') {
			onCancel();
		}
	});
	form.querySelectorAll('[data-button="reset-filter"]')[0].addEventListener('click', onReset);
	form.querySelectorAll('[data-button="cancel-filter"]')[0].addEventListener('click', onCancel);
	form.addEventListener('submit', onSubmit);
	return div;
}

function openPopup (data, cb) {
	var div;
	callback = cb;
	div = util.popup.show('filter', function () {
		return initPopup(data);
	});
	div.getElementsByTagName('input')[0].focus();
	util.fillForm(div.getElementsByTagName('form')[0], formDataFromCurrentFilter());
}

function closePopup (action) {
	var div = util.popup.hide();
	switch (action) {
	case 'apply':
		currentFilterFromForm(div.getElementsByTagName('form')[0]);
		break;
	case 'reset':
		resetFilter();
		break;
	}
}

resetFilter();

return {
	test: testFilter,
	openPopup: openPopup,
	closePopup: closePopup
};
})();
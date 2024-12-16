/*global l10n: true*/
l10n =
(function () {
"use strict";

var data = {
	de: {
		dateFormat: {
			year: '%Y',
			month: '%F %Y',
			date: '%j. %M %Y',
			local: '%j. %M %Y, %H:%i',
			global: '%j. %M %Y, %H:%i (%e)'
		},
		month: [
			'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
			'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
		],
		monthShort: [
			'Jan.', 'Feb.', 'Mär.', 'Apr.', 'Mai', 'Jun.',
			'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'
		],
		timezone: {'+00:00': 'UTC', '+01:00': 'MEZ', '+02:00': 'MESZ'},

		durUnits: ['s', 'min', 'h'],
		sizeUnits: ['B', 'KB', 'MB', 'GB'],

		authorCamera: {
			image: 'Fotograf: %a (%c)',
			video: 'Aufnahme: %a (%c)',
			audio: 'Aufnahme: %a (%c)',
			other: 'Autor: %a (%c)'
		},
		author: {
			image: 'Fotograf: %a',
			video: 'Aufnahme: %a',
			audio: 'Aufnahme: %a',
			other: 'Autor: %a'
		},
		camera: {
			image: 'Kamera: %c',
			video: 'Kamera: %c',
			other: 'Gerät: %c'
		},

		album: 'Album',
		albumTitle: 'Album – %t',

		folderUp: 'Zum übergeordneten Ordner wechseln',

		editTooltip: 'Bearbeiten [F2]',
		filterTooltip: 'Filtern [F3]',
		exportTooltip: 'Exportieren [F4]',
		hideInfoTooltip: 'Seitenleiste ausblenden [F5]',
		showInfoTooltip: 'Seitenleiste einblenden [F5]',

		filterHead: 'Filter',
		filterNone: '(ohne)',
		filterType: 'Typ: ',
		filterTypeImage: 'Bild',
		filterTypeVideo: 'Video',
		filterTypeAudio: 'Audio',
		filterTypeOther: 'Sonstiges',
		filterTypeTitle: 'Überschrift',
		filterTypeSeparator: 'Trennlinie',
		filterTypeFolder: '(leerer) Ordner',
		filterSearch: 'Suche: ',
		filterMinDate: 'Datum von: ',
		filterMaxDate: 'bis: ',
		filterPlace: 'Ort:',
		filterAuthor: 'Fotograf:',
		filterCamera: 'Kamera:',
		filterMinStars: 'Sterne von: ',
		filterMaxStars: 'bis: ',
		filterAllTags: 'Mit all diesen Schlagwörtern:',
		filterAnyTags: 'Mit einem dieser Schlagwörter:',
		filterNoneTags: 'Ohne diese Schlagwörter:',
		filterApply: 'Filter anwenden',
		filterReset: 'Filter zurücksetzen',
		filterCancel: 'Abbrechen',

		editHead: 'Bearbeiten',
		editTitle: 'Titel: ',
		editDesc: 'Beschreibung:',
		editDate: 'Datum: ',
		editPlace: 'Ort: ',
		editAuthor: 'Autor: ',
		editCamera: 'Kamera: ',
		editStars: 'Sterne: ',
		editTags: 'Schlagwörter (eines pro Zeile):',
		editApply: 'Änderungen anwenden',
		editCancel: 'Abbrechen',

		addHead: 'Hinzufügen',
		addType: 'Typ: ',
		addTypeFiles: 'Dateien',
		addTypeTitle: 'Hauptüberschrift',
		addTypeTitle3: 'Unterüberschrift',
		addTypeTitle4: 'Unterüberschrift 2',
		addTypeTitle5: 'Unterüberschrift 3',
		addTypeSeparator: 'Trennlinie',
		addTypeFolder: 'Ordner',
		addFiles: 'Dateien: ',
		addApply: 'Hinzufügen',
		addCancel: 'Abbrechen',
		addWait: 'Bitte warten …',

		exportHead: 'Export',
		exportData: 'Daten:',
		exportDone: 'Fertig',
		exportEdit: 'Extern bearbeiten'
	},
	en: {
		dateFormat: {
			year: '%Y',
			month: '%F %Y',
			date: '%M %j, %Y',
			local: '%M %j, %Y, %H:%i',
			global: '%M %j, %Y, %H:%i (%e)'
		},
		month: [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		],
		monthShort: [
			'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
			'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
		],
		timezone: {'+00:00': 'UTC', '+01:00': 'CET', '+02:00': 'CEST'},
		//TODO +01:00 could be 'WEST', too, etc.
		//To get the right abbr we need the actual timezone and much data
		//The timezone could be provided by something like RFC 9557, i.e.,
		//to allow suffixes like [Europe/Berlin] to the timestamp, but
		//it doesn't seem worth at this point.

		durUnits: ['s', 'min', 'h'],
		sizeUnits: ['B', 'KB', 'MB', 'GB'],

		authorCamera: {
			image: 'Photographer: %a (%c)',
			video: 'Recording: %a (%c)',
			audio: 'Recording: %a (%c)',
			other: 'Author: %a (%c)'
		},
		author: {
			image: 'Photographer: %a',
			video: 'Recording: %a',
			audio: 'Recording: %a',
			other: 'Author: %a'
		},
		camera: {
			image: 'Camera: %c',
			video: 'Camera: %c',
			other: 'Device: %c'
		},

		album: 'Album',
		albumTitle: 'Album – %t',

		folderUp: 'Go up to folder',

		editTooltip: 'Edit [F2]',
		filterTooltip: 'Filter [F3]',
		exportTooltip: 'Export [F4]',
		hideInfoTooltip: 'Hide sidebar [F5]',
		showInfoTooltip: 'Show sidebar [F5]',

		filterHead: 'Filter',
		filterNone: '(none)',
		filterType: 'Type: ',
		filterTypeImage: 'image',
		filterTypeVideo: 'video',
		filterTypeAudio: 'audio',
		filterTypeOther: 'other',
		filterTypeTitle: 'title',
		filterTypeSeparator: 'separator',
		filterTypeFolder: '(empty) folder',
		filterSearch: 'Search: ',
		filterMinDate: 'Date from: ',
		filterMaxDate: 'to: ',
		filterPlace: 'Place:',
		filterAuthor: 'Author:',
		filterCamera: 'Camera:',
		filterMinStars: 'Stars from: ',
		filterMaxStars: 'to: ',
		filterAllTags: 'With all these tags:',
		filterAnyTags: 'With one of these tags:',
		filterNoneTags: 'Without these tags:',
		filterApply: 'Apply filter',
		filterReset: 'Reset filter',
		filterCancel: 'Cancel',

		editHead: 'Edit',
		editTitle: 'Title: ',
		editDesc: 'Description:',
		editDate: 'Date: ',
		editPlace: 'Place: ',
		editAuthor: 'Author: ',
		editCamera: 'Camera: ',
		editStars: 'Stars: ',
		editTags: 'Tags (one per line):',
		editApply: 'Apply changes',
		editCancel: 'Cancel',

		addHead: 'Add',
		addType: 'Type: ',
		addTypeFiles: 'Files',
		addTypeTitle: 'Main title',
		addTypeTitle3: 'Subtitle',
		addTypeTitle4: 'Subtitle 2',
		addTypeTitle5: 'Subtitle 3',
		addTypeSeparator: 'Separator',
		addTypeFolder: 'Folder',
		addFiles: 'Files: ',
		addApply: 'Add',
		addCancel: 'Cancel',
		addWait: 'Please wait …',

		exportHead: 'Export',
		exportData: 'Data:',
		exportDone: 'Done',
		exportEdit: 'External edit'
	}
}, lang = 'en';

function setLang (l) {
	if (data[l]) {
		lang = l;
	} else {
		lang = 'en';
	}
	return lang;
}

function get (key) {
	return data[lang][key];
}

function pad (n, places) {
	n = String(n);
	while (n.length < places) {
		n = '0' + n;
	}
	return n;
}

function formatTime (data) {
	return get('dateFormat')[data.type].replace(/%(.)/g, function (all, c) {
		switch (c) {
		case 'Y': return data.year;
		case 'y': return pad(data.year % 100, 2);
		case 'M': return get('monthShort')[data.month - 1];
		case 'F': return get('month')[data.month - 1];
		case 'm': return pad(data.month, 2);
		case 'n': return data.month;
		case 'j': return data.date;
		case 'd': return pad(data.date, 2);
		case 'H': return pad(data.hour, 2);
		case 'G': return data.hour;
		case 'i': return pad(data.minute, 2);
		case 's': return pad(data.second, 2);
		case 'e': return get('timezone')[data.offset] || data.offset.replace('-', '\u2212');
		case '%': return '%';
		default: return all;
		}
	});
}

function parseTime (str) {
	var formats = [
		{
			re: /^(\d+)$/,
			type: 'year', params: ['year']
		},
		{
			re: /^(\d+)-(\d\d)$/,
			type: 'month', params: ['year', 'month']
		},
		{
			re: /^(\d+)-(\d\d)-(\d\d)$/,
			type: 'date', params: ['year', 'month', 'date']
		},
		{
			re: /^(\d+)-(\d\d)-(\d\d)[ T](\d\d):(\d\d):(\d\d)(?:\.\d+)?$/,
			type: 'local', params: ['year', 'month', 'date', 'hour', 'minute', 'second']
		},
		{
			re: /^(\d+)-(\d\d)-(\d\d)[ T](\d\d):(\d\d):(\d\d)(?:\.\d+)?(Z|[+\-]\d\d:?\d\d)$/,
			type: 'global', params: ['year', 'month', 'date', 'hour', 'minute', 'second', 'offset']
		}
	], i, j, result, data, val;
	for (i = 0; i < formats.length; i++) {
		result = formats[i].re.exec(str);
		if (result) {
			data = {
				original: str,
				type: formats[i].type
			};
			for (j = 0; j < formats[i].params.length; j++) {
				val = result[j + 1];
				if (formats[i].params[j] === 'offset') {
					val = val.replace(/(\d\d)(\d\d)/, '$1:$2');
					if (val === 'Z') {
						val = '+00:00';
					}
				} else {
					val = Number(val);
				}
				data[formats[i].params[j]] = val;
			}
			return data;
		}
	}
	return false;
}

function formatDuration (dur) {
	var h, m, s, str = [], unit;
	s = dur % 60;
	dur = (dur - s) / 60;
	m = dur % 60;
	h = (dur - m) / 60;
	s = Math.round(s);
	m = Math.round(m);
	h = Math.round(h);
	if (h) {
		str.push(h);
		str.push(pad(m, 2));
		str.push(pad(s, 2));
		unit = 2;
	} else if (m) {
		str.push(m);
		str.push(pad(s, 2));
		unit = 1;
	} else {
		str.push(s);
		unit = 0;
	}
	str = str.join(':');
	return str + '&nbsp;' + get('durUnits')[unit];
}

function formatSize (size) {
	var unit = 0;
	while (unit < 3 && size > 1000) {
		unit++;
		size /= 1024;
	}
	size = Math.round(size * 10) / 10;
	return size + '&nbsp;' + get('sizeUnits')[unit];
}

return {
	setLang: setLang,
	get: get,
	formatTime: function (str) {
		var data = parseTime(str);
		return data && formatTime(data);
	},
	formatDuration: formatDuration,
	formatSize: formatSize
};
})();
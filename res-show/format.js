/*global format: true*/
/*global l10n, util*/
format =
(function () {
"use strict";

function createStartTag (tag, attr) {
	return '<' + tag + ' ' + Object.keys(attr).map(function (key) {
		var val = attr[key];
		if (val === true) {
			return key;
		}
		if (val === false) {
			return '';
		}
		return key + '="' + util.escapeHtml(val) + '"';
	}).join(' ') + '>';
}

function validateLevel (level) {
	return [2, 3, 4, 5].indexOf(level) > -1 ? level : 2;
}

//based on code from QUnit
function getColor (text) {
	/*jshint bitwise: false*/
	var hex, i, hash = 0;

	for (i = 0; i < text.length; i++) {
		hash = ((hash << 5) - hash) + text.charCodeAt(i);
		hash |= 0;
	}

	hex = '00000' + (0x100000000 + hash).toString(16);
	return '#' + hex.slice(-6);
}

function formatItem (data, index, base) {
	var src = util.buildPath(base, data.path || ''),
		level, attr, el, thumb, poster;
	switch (data.type) {
	case 'title':
		level = validateLevel(data.level);
		el = '<h' + level + '>' + util.escapeHtml(data.title) + '</h' + level + '>';
		break;
	case 'separator':
		el = '<hr>';
		break;
	case 'folder':
		if (typeof data.poster === 'number') {
			poster = data.content[data.poster];
			poster = poster && (poster.thumb || poster.poster || poster.src);
		} else if (data.poster) {
			poster = data.poster;
		}
		if (poster) {
			poster = util.buildPath(util.buildPath(base, data.path || ''), poster);
		}
		el = '<svg width="200" height="200">' +
			'<path d="M 25,50 50,50 50,25 100,25 100,50 175,50 175,175 25,175 z"/>' +
			(poster ? '<image x="27" y="52" width="146" height="121" xlink:href="' + util.escapeHtml(poster) + '"/>' : '') +
			(data.title ? '<text x="100" y="195" textLength="175">' + util.escapeHtml(data.title) + '</text>' : '') +
			'</svg>';
		break;
	case 'image':
		attr = {};
		if (data.w && data.h) {
			attr.width = data.w;
			attr.height = data.h;
		}
		if (data.thumb) {
			thumb = util.buildPath(base, data.thumb);
			attr['data-attr'] = 'src';
			attr['data-full'] = src;
			attr['data-thumb'] = thumb;
			attr.src = thumb;
		} else {
			attr.src = src;
		}
		el = createStartTag('img', attr);
		break;
	case 'audio':
		el = createStartTag('audio', {src: src, controls: true}) + '</audio>';
		break;
	case 'video':
		attr = {};
		attr.src = src;
		if (data.w && data.h) {
			attr.width = data.w;
			attr.height = data.h;
		}
		if (data.thumb) {
			thumb = util.buildPath(base, data.thumb);
		}
		if (data.poster) {
			poster = util.buildPath(base, data.poster);
		}
		if (thumb && poster) {
			attr['data-attr'] = 'poster';
			attr['data-full'] = poster;
			attr['data-thumb'] = thumb;
			attr.poster = thumb;
		} else if (poster) {
			attr.poster = poster;
		}
		el = createStartTag('video', attr) + '</video>';
		break;
	case 'other':
		attr = {};
		attr.src = src;
		if (data.w && data.h) {
			attr.width = data.w;
			attr.height = data.h;
		}
		el = createStartTag('iframe', attr) + '</iframe>';
	}
	if (data.annotations && data.w && data.h) {
		el = createStartTag('div', {'class': 'annotation-container'}) +
			el +
			formatAnnotations(data.annotations, data.w, data.h) +
			'</div>';
	}
	return createStartTag('li', {
		'data-type': data.type,
		'data-index': index,
		'data-base': base
	}) + el + '</li>';
}

function formatAnnotations (annotations, w, h) {
	return createStartTag('svg', {
		width: w,
		height: h,
		viewbox: '0 0 ' + w + ' ' + h,
		'class': 'annotations'
	}) + '<rect x="0" y="0" width="' + w + '" height="' + h + '"/>' +
	Object.keys(annotations).map(function (key, i) {
		return createStartTag('g', {'class': 'annotation', title: key, 'data-annotation-index': i}) + annotations[key] + '</g>';
	}).join('') + '</svg>';
}

function formatTitle (title) {
	return title ? '<h2>' + util.escapeHtml(title) + '</h2>' : '';
}

function formatTypePath (type, path, size, base) {
	var icon = {
		image: '📷',
		video: '📹',
		audio: '🎤',
		other: '📄',
		folder: '📁'
	}, link;

	if (type === 'title' || type === 'separator') {
		return '';
	}

	if (path) {
		link = createStartTag('a', {href: util.buildPath(base, path), target: '_blank'});
		if (path.length > 32) {
			path = path.slice(0, 8) + '…' + path.slice(-16);
		}
		link += util.escapeHtml(path);
		link += '</a>';
	}

	return '<p>' +
		icon[type] +
		(link ? ' <code>' + link + '</code>' : '') +
		(size ? ' <small>(' + size + ')</small>' : '') +
		'</p>';
}

function formatSize (w, h, dur, size) {
	var html = [];
	if (w && h) {
		html.push(w + '×' + h);
	}
	if (dur) {
		html.push(l10n.formatDuration(dur));
	}
	if (size) {
		html.push(l10n.formatSize(size));
	}
	return html.join(', ');
}

function formatDesc (desc) {
	desc = (desc || '').trim();
	if (!desc) {
		return '';
	}
	return '<p>' + util.escapeHtml(desc).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
}

function formatDatePlace (date, place) {
	var i, iso, formattedDate, html = [];
	if (date) {
		i = date.indexOf('|');
		if (i === -1) {
			iso = date;
			date = '';
		} else {
			iso = date.slice(0, i);
			date = date.slice(i + 1);
		}
		formattedDate = l10n.formatTime(iso);
		if (formattedDate) {
			if (date) {
				date = '<time datetime="' + iso + '">' + util.escapeHtml(date) + ' <small>(' + formattedDate + ')</small></time>';
			} else {
				date = '<time datetime="' + iso + '">' + formattedDate + '</time>';
			}
		} else {
			date = util.escapeHtml(i === -1 ? iso : iso + '|' + date);
		}
		html.push(date);
	}
	if (place) {
		html.push(util.escapeHtml(place));
	}
	html = html.join(', ');
	return html ? '<p>' + html + '</p>' : '';
}

function formatAuthorCamera (type, author, camera) {
	var str;
	if (author && camera) {
		str = l10n.get('authorCamera');
	} else if (author) {
		str = l10n.get('author');
	} else if (camera) {
		str = l10n.get('camera');
	}
	if (str) {
		str = str[type] || str.other;
		return '<p>' + str.replace('%a', util.escapeHtml(author)).replace('%c', util.escapeHtml(camera)) + '</p>';
	}
	return '';
}

function formatStars (stars) {
	var full = '★', empty = '☆', i, html = [];
	if (!stars) {
		return '';
	}
	for (i = 1; i <= 5; i++) {
		html.push(i <= stars ? full : empty);
	}
	return '<p><data value="' + stars + '/5" class="stars">' + html.join('') + '</data></p>';
}

function formatTags (tags) {
	if (!tags || tags.length === 0) {
		return '';
	}
	return '<ul class="tag-cloud">' + tags.map(function (tag) {
		return '<li style="border-color: ' + getColor(tag) + ';">' + util.escapeHtml(tag) + '</li>';
	}).join('') + '</ul>';
}

function formatInfo (data, base) {
	return [
		formatTitle(data.title),
		formatTypePath(data.type, data.path, formatSize(data.w, data.h, data.dur, data.size), base),
		formatDesc(data.desc),
		formatDatePlace(data.date, data.place),
		formatAuthorCamera(data.type, data.author, data.camera),
		formatStars(data.stars),
		formatTags(data.tags)
	].join('');
}

function formatAlbum (data, folder, filter) {
	var title = data.title, content = data.content, showUp = false, path = data.path || './', i, html;
	for (i = 0; i < folder.length; i++) {
		showUp = true;
		data = content[folder[i]];
		title = data.title || title;
		content = data.content;
		path = util.buildPath(path, data.path || '');
	}
	title = title ? l10n.get('albumTitle').replace('%t', title) : l10n.get('album');
	html = '<ul>' + content.map(function (item, index) {
		if (!filter(item)) {
			return '';
		}
		return formatItem(item, index, path);
	}).join('') + '</ul>';
	if (showUp) {
		showUp = '<div class="folder-up"><p>' + l10n.get('folderUp') + '</p></div>';
		html = showUp + html + showUp;
	}
	return {
		title: title,
		html: html
	};
}

return {
	album: formatAlbum,
	info: formatInfo
};
})();
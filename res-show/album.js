/*global l10n, util, format, edit, filter*/
/*global globalData*/
(function () {
"use strict";

var currentState,
	allowPath = false;

function scrollIntoViewIfNeeded (el) {
	var scrollingElement = document.getElementsByTagName('html')[0];
	if (scrollingElement.scrollTop + scrollingElement.clientHeight < el.offsetTop + el.offsetHeight) {
		scrollingElement.scrollTop = el.offsetTop + el.offsetHeight - scrollingElement.clientHeight;
	} else if (scrollingElement.scrollTop > el.offsetTop) {
		scrollingElement.scrollTop = el.offsetTop;
	}
}

function getCurrentItem () {
	var li;
	li = document.getElementsByClassName('big');
	if (!li.length) {
		li = document.getElementsByClassName('selected');
	}
	return li[0];
}

function getItem (index) {
	var content = currentState.data.content, i;
	for (i = 0; i < currentState.folder.length; i++) {
		content = content[currentState.folder[i]].content;
	}
	return content[index];
}

function updateItem (index, data) {
	var content = currentState.data.content, i;
	for (i = 0; i < currentState.folder.length; i++) {
		content = content[currentState.folder[i]].content;
	}
	Object.keys(data).forEach(function (key) {
		if (data[key] && (key !== 'tags' || data[key].length)) {
			content[index][key] = data[key];
			//TODO keep canonical order
		} else {
			delete content[index][key];
		}
	});
}

function addItems (data) {
	var content = currentState.data.content, i;
	for (i = 0; i < currentState.folder.length; i++) {
		content = content[currentState.folder[i]].content;
	}
	for (i = 0; i < data.length; i++) {
		content.push(data[i]);
	}
}

function showThumb (li) {
	var els = li.querySelectorAll('[data-attr]'), i, el;
	for (i = 0; i < els.length; i++) {
		el = els[i];
		el[el.dataset.attr] = el.dataset.thumb;
	}
	if (li.dataset.type === 'video') {
		li.querySelector('video').controls = false;
	}
}

function showFull (li) {
	var els = li.querySelectorAll('[data-attr]'), i, el;
	for (i = 0; i < els.length; i++) {
		el = els[i];
		el[el.dataset.attr] = el.dataset.full;
	}
	if (li.dataset.type === 'video') {
		li.querySelector('video').controls = true;
	}
}

function showInfo (html) {
	document.getElementById('info').innerHTML = html;
}

function selectItem (li, prev, cls) {
	if (prev) {
		prev.className = '';
	}
	cls = cls || 'selected';
	li.className = cls;
	if (cls === 'selected') {
		scrollIntoViewIfNeeded(li);
	}
	showInfo(format.info(getItem(li.dataset.index), li.dataset.base));
}

function getNextElement (start, dir, noTitle) {
	var next;
	if (start) {
		if (dir === -1) {
			next = start.previousSibling;
		} else {
			next = start.nextSibling;
		}
	} else {
		if (dir === -1) {
			next = document.getElementById('list').getElementsByTagName('ul')[0].lastChild;
		} else {
			next = document.getElementById('list').getElementsByTagName('ul')[0].firstChild;
		}
	}
	while (
		(noTitle && next && next.dataset.type === 'title') ||
		(next && next.dataset.type === 'separator')
	) {
		if (dir === -1) {
			next = next.previousSibling;
		} else {
			next = next.nextSibling;
		}
	}
	return next;
}

function selectNext (dir, noTitle) {
	var li, next;
	li = document.getElementsByClassName('selected');
	if (li.length) {
		next = getNextElement(li[0], dir, noTitle);
		if (next) {
			selectItem(next, li[0]);
		}
		return;
	}
	li = document.getElementsByClassName('big');
	if (li.length) {
		next = getNextElement(li[0], dir, true);
		if (next) {
			if (next.dataset.type === 'folder') {
				enterFolder(next.dataset.index, dir);
			} else {
				selectItem(next, li[0], 'big');
				showThumb(li[0]);
				showFull(next);
			}
		} else if (document.getElementsByClassName('folder-up').length) {
			exitFolder(dir);
		}
		return;
	}
	next = getNextElement(null, dir, noTitle);
	if (next) {
		selectItem(next);
	}
}

function makeBig (recurse) {
	var li = document.getElementsByClassName('selected');
	if (!li.length) {
		return;
	}
	li = li[0];
	if (li.dataset.type === 'folder') {
		enterFolder(li.dataset.index, recurse);
	} else if (li.dataset.type !== 'title') {
		li.className = 'big';
		showFull(li);
	}
}

function unselect () {
	var li = document.getElementsByClassName('big');
	if (li.length) {
		li = li[0];
		li.className = 'selected';
		showThumb(li);
		scrollIntoViewIfNeeded(li);
		return;
	}
	li = document.getElementsByClassName('selected');
	if (li.length) {
		li[0].className = '';
		showInfo('');
	}
}

function enterFolder (index, dir) {
	currentState.folder.push(index);
	updatePage(true);
	if (dir) {
		selectNext(dir, true);
		makeBig(dir);
	}
}

function exitFolder (dir) {
	var folder = currentState.folder.pop();
	updatePage();
	selectItem(currentState.container.querySelector('[data-index="' + folder + '"]'));
	if (dir) {
		selectNext(dir, true);
		if (getCurrentItem().dataset.index === folder) { //this was the last/first image
			//so we re-enter from the other direction
			makeBig(-dir);
		} else {
			makeBig(dir);
		}
	}
}

function markSavedUnsaved (unsaved) {
	document.getElementById('button-export').className = unsaved ? 'unsaved' : '';
}

function showEditPopup () {
	var li = getCurrentItem(), index, wasBig;
	if (!li) {
		edit.openAddPopup(function (action) {
			edit.closeAddPopup(action === 'add' ? function (data) {
				addItems(data);
				updatePage();
				util.popup.destroy('filter'); //there may be new values
				markSavedUnsaved(true);
			} : null);
		});
		return;
	}
	index = li.dataset.index;
	wasBig = (li.className === 'big');
	edit.openPopup(getItem(index), function (action) {
		var data = edit.closePopup();
		if (action === 'edit') {
			updateItem(index, data);
			updatePage();
			util.popup.destroy('filter'); //there may be new values
			li = currentState.container.querySelector('[data-index="' + index + '"]');
			if (li) { //might no longer be shown due to filter
				selectItem(li);
				if (wasBig) {
					makeBig();
				}
			}
			markSavedUnsaved(true);
		} else {
			scrollIntoViewIfNeeded(li);
		}
	});
}

function showFilterPopup () {
	filter.openPopup(currentState.data, function (action) {
		var li;
		filter.closePopup(action);
		if (action !== 'cancel') {
			currentState.folder = [];
			updatePage();
		} else {
			li = getCurrentItem();
			if (li) {
				scrollIntoViewIfNeeded(li);
			}
		}
	});
}

function showExportPopup () {
	edit.openExportPopup(currentState.data, function () {
		var li;
		edit.closeExportPopup();
		markSavedUnsaved(false);
		li = getCurrentItem();
		if (li) {
			scrollIntoViewIfNeeded(li);
		}
	});
}

function toggleFullscreen () {
	var li, body;
	body = document.body;
	//TODO actually switching to fullscreen causes more problems than it solves
	//so just keep it this way for now
	if (body.className) {
		/*if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		}*/
		body.className = '';
	} else {
		/*if (body.requestFullscreen) {
			body.requestFullscreen();
		} else if (body.mozRequestFullScreen) {
			body.mozRequestFullScreen();
		}*/
		body.className = 'fullscreen';
	}
	li = getCurrentItem();
	if (li) {
		scrollIntoViewIfNeeded(li);
	}
}

function handleLiClick (li, hasControls) {
	if (li.dataset.type === 'separator') {
		return;
	}
	if (li.className === 'selected') {
		if (li.dataset.type === 'folder') {
			enterFolder(li.dataset.index);
		} else if (li.dataset.type !== 'title') {
			li.className = 'big';
			showFull(li);
		}
		return;
	}
	if (li.className === 'big') {
		if (hasControls) {
			return;
		}
		li.className = 'selected';
		showThumb(li);
		scrollIntoViewIfNeeded(li);
		return;
	}

	selectItem(li, document.getElementsByClassName('selected')[0]);
}

function handleKey (e) {
	var done = false;
	switch (util.getKey(e)) {
	case 'Enter':
		makeBig();
		done = true;
		break;
	case 'Escape':
		unselect();
		done = true;
		break;
	case 'ArrowRight':
		selectNext(1);
		done = true;
		break;
	case 'ArrowLeft':
		selectNext(-1);
		done = true;
		break;
	case 'F2':
		showEditPopup();
		done = true;
		break;
	case 'F3':
		showFilterPopup();
		done = true;
		break;
	case 'F4':
		showExportPopup();
		done = true;
		break;
	case 'F5':
		toggleFullscreen();
		done = true;
		break;
	}
	if (done) {
		e.preventDefault();
	}
}

function getParent (el, tag) {
	while (el && el.tagName !== tag) {
		el = el.parentElement;
	}
	return el;
}

function handleAnnotation (e) {
	var el;

	el = document.querySelector('.annotation-list .current');
	if (el) {
		el.className = '';
	}

	el = getParent(e.target, 'g');
	while (el && el.className.animVal !== 'annotation') {
		el = getParent(el.parentElement, 'g');
	}
	if (el && getParent(el, 'LI').className) {
		document.querySelector('.annotation-list [data-annotation-index="' + el.getAttribute('data-annotation-index') + '"]').className = 'current';
	}
}

function handleAnnotationList (e) {
	var el;

	el = document.querySelector('.annotation.current');
	if (el) {
		el.setAttribute('class', 'annotation');
	}

	el = getParent(e.target, 'LI');
	if (el && el.parentElement.className === 'annotation-list') {
		document.querySelector('.annotation[data-annotation-index="' + el.getAttribute('data-annotation-index') + '"]').setAttribute('class', 'annotation current');
	}
}

function initButtons () {
	var button;
	button = document.getElementById('button-edit');
	button.addEventListener('click', showEditPopup);
	button.title = l10n.get('editTooltip');
	button = document.getElementById('button-filter');
	button.addEventListener('click', showFilterPopup);
	button.title = l10n.get('filterTooltip');
	button = document.getElementById('button-export');
	button.addEventListener('click', showExportPopup);
	button.title = l10n.get('exportTooltip');
	button = document.getElementById('button-hide-info');
	button.addEventListener('click', toggleFullscreen);
	button.title = l10n.get('hideInfoTooltip');
	button = document.getElementById('button-show-info');
	button.addEventListener('click', toggleFullscreen);
	button.title = l10n.get('showInfoTooltip');
}

function initEvents (container) {
	container.addEventListener('click', function (e) {
		var el;
		el = getParent(e.target, 'LI');
		if (el) {
			handleLiClick(el, e.target.controls);
		} else {
			el = getParent(e.target, 'DIV');
			if (el && el.className === 'folder-up') {
				exitFolder();
			} else {
				unselect();
			}
		}
	});
	document.addEventListener('keydown', handleKey);
	document.addEventListener('mousemove', function (e) {
		handleAnnotation(e);
		handleAnnotationList(e);
	});
	initButtons();
}

function updatePage (keepInfo) {
	var render = format.album(currentState.data, currentState.folder, filter.test);
	document.title = render.title;
	currentState.container.innerHTML = render.html;
	document.getElementsByTagName('html')[0].scrollTop = 0;
	if (!keepInfo) {
		showInfo('');
	}
}

function init (data, container) {
	if (!allowPath) {
		delete data.path;
	}
	document.documentElement.lang = l10n.setLang(data.lang);
	initEvents(container);
	currentState = {
		data: data,
		folder: [],
		container: container
	};
	updatePage();
}

init(globalData, document.getElementById('list'));

})();
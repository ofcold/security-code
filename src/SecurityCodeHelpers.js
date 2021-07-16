export function previousElement (event, length) {
	event.target.parentNode.parentNode.children[length].firstChild.focus();
}

/**
 * Find next element.
 *
 * @param {any} event
 */
export function nextElement (event) {

	let parentNode = event.target.parentNode;

	let nextSibling = parentNode.nextSibling;

	nextSibling && nextSibling.nodeType === 1 ? nextSibling.firstChild.focus() : parentNode.focus();
}

export function isMainKeyCode (keyCode) {
	return keyCode >= 48 && keyCode <= 57;
}

export function isTab (keyCode) {
	return keyCode === 9;
}

export function isBackspace (keyCode) {
	return keyCode === 8;
}

export function isMetaKey (event, keyCode) {
	return event.metaKey && keyCode === 118;
}

export function getClipboardData (event, max) {
	// const win = <Window>window;
	const pasteData = event.clipboardData && event.clipboardData.getData
		 ? event.clipboardData.getData('Text')
		 : 'undefined';
	// const pasteData = event.clipboardData && event.clipboardData.getData
	// 	 ? event.clipboardData.getData('Text')
	// 	 ：win.clipboardData && win.clipboardData.getData ? win.clipboardData.getData('Text'): 'undefined';

	if (pasteData === 'undefined') {
		return [];
	}

	return pasteData.replace(/\s/g, '').substr(0, max).split('').map(v => Number(v));
}

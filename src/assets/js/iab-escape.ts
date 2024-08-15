// Ref: https://frontendmasters.com/blog/the-pitfalls-of-in-app-browsers/

import InAppSpy from 'inapp-spy';

// eslint-disable-next-line new-cap
const { isInApp } = InAppSpy();

const url = `https://madcampos.dev`;
const intentLink = `intent:${url}#Intent;end`;
const shortcutsLink = `shortcuts://x-callback-url/run-shortcut?name=${crypto.randomUUID()}&x-error=${encodeURIComponent(url)}`;

if (isInApp) {
	let link = shortcutsLink;

	if (navigator.userAgent.includes('Android')) {
		link = intentLink;
	}

	window.location.replace(link);

	const $div = document.createElement('div');
	$div.innerHTML = `
		<p>Tap the button to open in your default browser</p>
		<a href="${link}" target="_blank">Open</a>
	`;
	document.body.insertAdjacentElement('afterbegin', $div);
}

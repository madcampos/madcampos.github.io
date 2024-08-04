// Ref: https://frontendmasters.com/blog/the-pitfalls-of-in-app-browsers/

import InAppSpy from 'inapp-spy';
const { isInApp } = InAppSpy();

const url = `https://madcampos.dev`;
const intentLink = `intent:${url}#Intent;end`;

if (isInApp) {
	window.location.replace(intentLink);

	const $div = document.createElement('div');
	$div.innerHTML = `
		<p>Tap the button to open in your default browser</p>
		<a href="${intentLink}" target="_blank">Open</a>
	`;
	document.body.insertAdjacentElement('afterbegin', $div);
}

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('form')?.addEventListener('submit', (evt) => {
		evt.preventDefault();
		evt.stopPropagation();

		// eslint-disable-next-line no-alert
		alert('ALL YOUR BASE ARE BELONG TO US!!!');
	});
});

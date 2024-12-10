document.addEventListener('DOMContentLoaded', () => {
	const selectedTheme = new URLSearchParams(document.location.search).get('theme') ?? localStorage.getItem('theme');

	if (selectedTheme) {
		const themeInput = document.querySelector<HTMLInputElement>(`#theme-switcher input[type="radio"][value="${selectedTheme}"]`);

		if (themeInput) {
			themeInput.checked = true;
		}

		document.documentElement.dataset['theme'] = selectedTheme;
	}

	document.querySelector('#theme-switcher form')?.addEventListener('submit', (evt) => {
		evt.preventDefault();
		evt.stopPropagation();
		document.querySelector<HTMLDialogElement>('#theme-switcher-dialog')?.hidePopover();

		const theme = new FormData(evt.target as HTMLFormElement).get('theme') as string;

		document.documentElement.dataset['theme'] = theme;
		localStorage.setItem('theme', theme);
	});
});

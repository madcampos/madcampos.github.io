interface SiteSettings {
	theme?: string;
}

document.addEventListener('DOMContentLoaded', () => {
	const settings: SiteSettings = {
		theme: localStorage.getItem('theme') ?? undefined
	};

	for (const [setting, value] of Object.entries(settings)) {
		if (value !== undefined) {
			document.body.dataset[setting] = value;
		}
	}
});

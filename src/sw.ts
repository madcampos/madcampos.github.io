import { registerSW } from 'virtual:pwa-register';

window.addEventListener('load', () => {
	const pwaToast = document.querySelector('#pwa-toast') as HTMLDivElement;
	const pwaToastMessage = pwaToast.querySelector('#toast-message') as HTMLDivElement;

	const refreshSW = registerSW({
		immediate: true,
		onOfflineReady() {
			pwaToastMessage.innerHTML = 'App ready to work offline';
			pwaToast.dataset['offline'] = 'true';
		},
		onNeedRefresh() {
			pwaToastMessage.innerHTML = 'New content available, click on reload button to update';
			pwaToast.dataset['refresh'] = 'true';
		},
		onRegisteredSW(swScriptUrl) {
			// eslint-disable-next-line no-console
			console.log('SW registered: ', swScriptUrl);
		}
	});

	const pwaEventListener: EventListener = (evt) => {
		const target = evt.target as HTMLElement;

		if (target.matches('#pwa-close')) {
			requestAnimationFrame(() => {
				document.body.removeEventListener('click', pwaEventListener);
				pwaToast.remove();
			});
		}

		if (target.matches('#pwa-refresh')) {
			requestAnimationFrame(async () => refreshSW(true));
		}
	};

	document.body.addEventListener('click', pwaEventListener);
});

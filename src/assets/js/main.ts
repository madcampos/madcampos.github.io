import { registerSW } from 'virtual:pwa-register';

const params = new URLSearchParams(document.location.search.substring(1));

function setPwaMessage(type: 'offline' | 'refresh') {
	const pwaToast = document.querySelector('#pwa-toast') as HTMLDivElement;
	const pwaToastMessage = pwaToast.querySelector('#toast-message') as HTMLDivElement;

	switch (type) {
		case 'refresh':
			pwaToastMessage.innerHTML = 'New content available, click on reload button to update.';
			pwaToast.dataset['refresh'] = 'true';
			break;
		case 'offline':
			pwaToastMessage.innerHTML = 'App ready to work offline.';
			pwaToast.dataset['offline'] = 'true';
			break;
		default:
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const refreshSW = registerSW({
		immediate: true,
		onOfflineReady() {
			setPwaMessage('offline');
		},
		onNeedRefresh() {
			setPwaMessage('refresh');
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
				document.querySelector('#pwa-toast')?.remove();

				params.delete('debug');
				document.location.search = params.toString();
			});
		}

		if (target.matches('#pwa-refresh')) {
			params.delete('debug');
			document.location.search = params.toString();

			requestAnimationFrame(async () => refreshSW(true));
		}
	};

	if (params.get('debug')?.startsWith('pwa-')) {
		setPwaMessage((params.get('debug')?.replace('pwa-', '') ?? '') as 'offline' | 'refresh');
	}

	document.body.addEventListener('click', pwaEventListener);
});

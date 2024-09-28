/* eslint-disable @typescript-eslint/no-magic-numbers */

import type { VitePWAOptions } from 'vite-plugin-pwa';

type Unpacked<T> = NonNullable<T extends (infer U)[] ? U : T>;

type RuntimeCaching = Unpacked<VitePWAOptions['workbox']['runtimeCaching']>;

export const pageRedirect: RuntimeCaching = {
	urlPattern: ({ sameOrigin, request }) => sameOrigin && request.destination === 'document' && request.url.endsWith('/'),
	handler: async ({ request }) => {
		console.log(request);
		// TODO: respond with a redirect
		const response = new Response();

		return Promise.resolve(response);
	}
};

export const pagesCache: RuntimeCaching = {
	urlPattern: ({ sameOrigin, request }) => {
		const isCacheHit = sameOrigin && request.destination === 'document';

		if (isCacheHit) {
			console.log('Pages cache hit');
			console.log(request);
		}

		return isCacheHit;
	},
	handler: 'NetworkFirst',
	options: {
		matchOptions: { ignoreSearch: true },
		precacheFallback: { fallbackURL: '/offline/index.html' },
		cacheName: 'pages-cache',
		expiration: {
			maxAgeSeconds: 60 * 60 * 24,
			maxEntries: 100
		},
		cacheableResponse: {
			statuses: [0, 200]
		}
	}
};

export const assetsCache: RuntimeCaching = {
	urlPattern: ({ request, sameOrigin }) => {
		const isCacheHit = sameOrigin && ['font', 'image'].includes(request.destination);

		if (isCacheHit) {
			console.log('Assets cache hit');
			console.log(request);
		}

		return isCacheHit;
	},
	handler: 'CacheFirst',
	options: {
		cacheName: 'assets-cache',
		expiration: {
			maxAgeSeconds: 60 * 60 * 24 * 30 * 12,
			maxEntries: 500
		},
		rangeRequests: true,
		cacheableResponse: {
			statuses: [0, 200]
		}
	}
};

export const scriptsCache: RuntimeCaching = {
	urlPattern: ({ request, sameOrigin }) => {
		const isCacheHit = sameOrigin && ['script', 'style'].includes(request.destination);

		if (isCacheHit) {
			console.log('Scripts cache hit');
			console.log(request);
		}

		return isCacheHit;
	},
	handler: 'StaleWhileRevalidate',
	options: {
		cacheName: 'scripts-cache',
		expiration: {
			maxAgeSeconds: 60 * 60 * 24,
			maxEntries: 100
		},
		cacheableResponse: {
			statuses: [0, 200]
		},
		backgroundSync: {
			name: 'scripts-sync',
			options: {
				maxRetentionTime: 60 * 60 * 24
			}
		}
	}
};

export const externalResourcesCache: RuntimeCaching = {
	urlPattern: ({ sameOrigin, request }) => {
		const isCacheHit = !sameOrigin;

		if (isCacheHit) {
			console.log('External cache hit');
			console.log(request);
		}

		return isCacheHit;
	},
	handler: 'NetworkOnly'
};

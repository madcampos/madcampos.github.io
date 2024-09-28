/* eslint-disable @typescript-eslint/no-magic-numbers */

import type { VitePWAOptions } from 'vite-plugin-pwa';

type Unpacked<T> = NonNullable<T extends (infer U)[] ? U : T>;

type RuntimeCaching = Unpacked<VitePWAOptions['workbox']['runtimeCaching']>;

export const pagesCache: RuntimeCaching = {
	urlPattern: ({ sameOrigin, request }) => {
		const isCacheHit = sameOrigin && request.destination === 'document';

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
	urlPattern: ({ sameOrigin }) => {
		const isCacheHit = !sameOrigin;

		return isCacheHit;
	},
	handler: 'NetworkOnly'
};

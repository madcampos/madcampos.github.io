/* eslint-disable @typescript-eslint/no-magic-numbers */

import type { VitePWAOptions } from 'vite-plugin-pwa';

type Unpacked<T> = NonNullable<T extends (infer U)[] ? U : T>;

type RuntimeCaching = Unpacked<VitePWAOptions['workbox']['runtimeCaching']>;

export const pagesCache: RuntimeCaching = {
	urlPattern: ({ url }) => url.origin === location.origin && !(/\.(?:png|gif|jpg|jpeg|webp|svg|ico|woff2|js|json|xml|xsl|webmanifest|css)$/iu).test(url.pathname),
	handler: 'NetworkFirst',
	options: {
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
	urlPattern: ({ url }) => url.origin === location.origin && (/\.(?:png|gif|jpg|jpeg|webp|svg|ico|woff2)$/iu).test(url.pathname),
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
	urlPattern: ({ url }) => url.origin === location.origin && (/\.(?:js|json|xml|xsl|webmanifest|css)$/iu).test(url.pathname),
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
	urlPattern: ({ url }) => url.origin !== location.origin,
	handler: 'NetworkOnly'
};

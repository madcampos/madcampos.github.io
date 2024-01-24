import type { VitePWAOptions } from 'vite-plugin-pwa';

type Unpacked<T> = NonNullable<T extends (infer U)[] ? U : T>;

type RuntimeCaching = Unpacked<VitePWAOptions['workbox']['runtimeCaching']>;

const baseUrl = 'https://sdrlog.madcampos.dev/';

export const internalResources: RuntimeCaching = {
	urlPattern: new RegExp(`^${baseUrl}.*`, 'iu'),
	handler: 'CacheFirst',
	options: {
		cacheName: 'app-cache',
		expiration: {
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			maxAgeSeconds: 60 * 60 * 24 * 30,
			maxEntries: 100
		}
	}
};

export const externalResources: RuntimeCaching = {
	urlPattern: new RegExp(`^(?!${baseUrl}).*`, 'iu'),
	handler: 'NetworkOnly'
};

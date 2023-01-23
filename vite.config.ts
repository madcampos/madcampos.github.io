/* eslint-disable camelcase, @typescript-eslint/no-magic-numbers */
// eslint-env node
import { readFileSync } from 'fs';

import { defineConfig, type UserConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import { type ManifestOptions, VitePWA as vitePWA } from 'vite-plugin-pwa';
import vitePluginHtmlEnv from 'vite-plugin-html-env';

const sslOptions = {
	cert: readFileSync('./certs/server.crt'),
	key: readFileSync('./certs/server.key')
};

const packageJson: PackageJsonVariables = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

export default defineConfig(({ mode }) => {
	const env = {
		APP_PUBLIC_URL: packageJson.homepage,

		APP_NAME: packageJson.displayName,
		APP_SHORT_NAME: packageJson.shortName,
		APP_DESCRIPTION: packageJson.description,
		APP_KEYWORDS: packageJson.keywords.join(', '),
		APP_AUTHOR: packageJson.author.name,
		APP_VERSION: packageJson.version,

		APP_THEME_COLOR: '#0080ff',
		APP_BACKGROUND_COLOR: '#252525',

		APP_APPLE_ICON: '/icons/maskable/apple-icon-180.png',
		APP_SMALL_ICON: '/icons/transparent/manifest-icon-192.png',
		APP_SMALL_ICON_BG: '/icons/maskable/manifest-icon-192.png',
		APP_LARGE_ICON: '/icons/transparent/manifest-icon-512.png',
		APP_LARGE_ICON_BG: '/icons/maskable/manifest-icon-512.png',
		APP_SOCIAL_IMAGE: 'images/me.jpg',
		...loadEnv(mode, process.cwd(), 'APP_')
	};

	const manifest = {
		id: 'a51d10e1-ffc3-4214-b4bd-b33691d1cdb1',
		name: env.APP_NAME,
		short_name: env.APP_SHORT_NAME,
		lang: 'en-US',
		description: env.APP_DESCRIPTION,
		categories: ['personal', 'website', 'site'],
		display: 'standalone',
		orientation: 'portrait',
		background_color: env.APP_BACKGROUND_COLOR,
		theme_color: env.APP_THEME_COLOR,
		icons: [
			{
				src: env.APP_SMALL_ICON,
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any'
			},
			{
				src: env.APP_SMALL_ICON_BG,
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable'
			},
			{
				src: env.APP_LARGE_ICON,
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any'
			},
			{
				src: env.APP_LARGE_ICON_BG,
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable'
			}
		],
		capture_links: 'existing-client-navigate',
		url_handlers: [{ origin: '%PUBLIC_URL%' }],
		launch_handler: { client_mode: 'navigate-existing' }
	};

	const config: UserConfig = {
		plugins: [
			chunkSplitPlugin({ strategy: 'unbundle' }),
			vitePluginHtmlEnv({
				compiler: false,
				compress: true,
				envPrefixes: 'APP_',
				prefix: '{{',
				suffix: '}}',
				...env
			}),
			vitePWA({
				manifest: manifest as Partial<ManifestOptions>,
				scope: '/',
				injectRegister: null,
				devOptions: {
					enabled: false
				}
			})
		],
		envPrefix: 'APP_',
		envDir: '../',
		root: 'src',
		publicDir: '../public',
		assetsInclude: ['locales/**/*.json'],
		clearScreen: false,
		server: {
			https: sslOptions,
			open: false,
			cors: true,
			port: 3000
		},
		build: {
			target: 'esnext',
			emptyOutDir: true,
			outDir: '../dist',
			rollupOptions: {
				output: {
					generatedCode: 'es2015',
					inlineDynamicImports: false
				}
			}
		},
		preview: {
			https: sslOptions,
			open: true
		},
		test: {
			include: ['**/*.test.ts'],
			minThreads: 1,
			maxThreads: 4,
			passWithNoTests: true,
			maxConcurrency: 4,
			coverage: {
				functions: 75,
				branches: 75,
				lines: 75,
				statements: 75
			}
		}
	};

	return config;
});

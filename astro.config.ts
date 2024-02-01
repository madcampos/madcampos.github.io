import { readFileSync } from 'node:fs';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import astroPWA, { type PwaOptions } from '@vite-pwa/astro';
import astroIcon from 'astro-icon';

import remarkBreaks from 'remark-breaks';
import rehypeExternalLinks from 'rehype-external-links';

import { externalResources, internalResources } from './src/sw-caching';

const manifest: PwaOptions['manifest'] = JSON.parse(readFileSync('./src/manifest.json', { encoding: 'utf8' }));

export default defineConfig({
	site: 'https://madcampos.dev/',
	base: '/',
	trailingSlash: 'ignore',
	devToolbar: { enabled: false },
	compressHTML: true,
	build: {
		format: 'directory'
	},
	server: {
		host: 'localhost',
		port: 3000
	},
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: 'dark-plus'
		},
		remarkPlugins: [remarkBreaks],
		rehypePlugins: [[rehypeExternalLinks, { rel: ['external', 'noopener', 'noreferrer'] }]]
	},
	integrations: [
		astroPWA({
			registerType: 'prompt',
				minify: true,
				includeAssets: ['/icons/favicon.svg'],
				manifest,
				workbox: {
					cleanupOutdatedCaches: true,
					clientsClaim: true,
					navigationPreload: false,
					runtimeCaching: [
						internalResources,
						externalResources
					]
				},
				devOptions: {
					enabled: false
				}
		}),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date()
		}),
		astroIcon({
			iconDir: 'src/assets/icons'
		})
	]
});

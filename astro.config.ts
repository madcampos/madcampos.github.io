import { readFileSync } from 'node:fs';

import sitemap from '@astrojs/sitemap';
import astroPWA, { type PwaOptions } from '@vite-pwa/astro';
import astroIcon from 'astro-icon';
import { defineConfig } from 'astro/config';

import rehypeShiki from '@shikijs/rehype';
import {
	transformerMetaHighlight,
	transformerMetaWordHighlight,
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationFocus,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
	transformerRenderWhitespace
} from '@shikijs/transformers';
import { transformerTwoslash } from '@shikijs/twoslash';
import rehypeExternalLinks from 'rehype-external-links';
import remarkBreaks from 'remark-breaks';

import { assetsCache, externalResourcesCache, pagesCache, scriptsCache } from './src/sw-caching';

const manifest: PwaOptions['manifest'] = JSON.parse(readFileSync('./src/manifest.json', { encoding: 'utf8' }));

const mode = process.env['NODE_ENV'] === 'production' ? 'production' : 'development';

export default defineConfig({
	site: 'https://madcampos.dev/',
	base: '/',
	trailingSlash: 'never',
	devToolbar: { enabled: false },
	compressHTML: true,
	build: {
		format: 'directory'
	},
	server: {
		host: 'localhost',
		port: 3000
	},
	...(mode !== 'production' && {
		vite: {
			server: {
				https: {
					cert: './certs/server.crt',
					key: './certs/server.key'
				}
			}
		}
	}),
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: 'css-variables',
			themes: {
				light: 'light-plus',
				dark: 'dark-plus'
			},
			wrap: true,
			transformers: [
				transformerTwoslash({
					explicitTrigger: true,
					rendererRich: { errorRendering: 'hover' }
				}),
				transformerNotationDiff(),
				transformerNotationHighlight(),
				transformerNotationWordHighlight(),
				transformerNotationFocus(),
				transformerNotationErrorLevel(),
				transformerRenderWhitespace({ position: 'boundary' }),
				transformerMetaHighlight(),
				transformerMetaWordHighlight()
			]
		},
		remarkPlugins: [remarkBreaks],
		rehypePlugins: [rehypeShiki, [rehypeExternalLinks, { rel: ['external', 'noopener', 'noreferrer'] }]]
	},
	integrations: [
		astroPWA({
			registerType: 'prompt',
				minify: true,
				includeAssets: ['/icons/favicon.svg'],
				manifest,
				workbox: {
					// eslint-disable-next-line @typescript-eslint/no-magic-numbers
					maximumFileSizeToCacheInBytes: 1024 * 128,
					cleanupOutdatedCaches: true,
					clientsClaim: true,
					skipWaiting: false,
					navigateFallback: '/offline',
					navigateFallbackDenylist: [/\.(?:png|gif|jpg|jpeg|webp|svg|ico)$/iu],
					directoryIndex: 'index.html',
					runtimeCaching: [externalResourcesCache, assetsCache, scriptsCache, pagesCache]
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

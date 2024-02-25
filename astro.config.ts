/// <reference types="mdast-util-directive" />

import type { Root } from 'mdast';
import type { VFile } from 'vfile';

import { readFileSync } from 'node:fs';

import sitemap from '@astrojs/sitemap';
import astroPWA, { type PwaOptions } from '@vite-pwa/astro';
import astroIcon from 'astro-icon';
import { defineConfig } from 'astro/config';

import rehypeExternalLinks from 'rehype-external-links';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';

import { assetsCache, externalResourcesCache, pagesCache, scriptsCache } from './src/sw-caching';

const manifest: PwaOptions['manifest'] = JSON.parse(readFileSync('./src/manifest.json', { encoding: 'utf8' }));

const mode = process.env['NODE_ENV'] === 'production' ? 'production' : 'development';

function remarkYoutube() {
	return (tree: Root, file: VFile) => {
		visit(tree, (node) => {
			if (node.type === 'textDirective' || node.type === 'containerDirective' || node.type === 'leafDirective') {
				if (node.name !== 'youtube') {
					return;
				}

				const data = node.data ?? {};
				const attributes = node.attributes ?? {};
				const { id } = attributes;

				if (node.type === 'textDirective') {
					file.fail(
						'Unexpected `:youtube` text directive, use two colons for a leaf directive',
						node
					);
				}

				if (!id) {
					file.fail('Unexpected missing `id` on `youtube` directive', node);
				}

				data.hName = 'iframe';
				data.hProperties = {
					src: `https://www.youtube.com/embed/${id}`,
					width: 200,
					height: 200,
					frameBorder: 0,
					allow: 'picture-in-picture',
					allowFullScreen: true
				};
			}
		});
	};
}

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
			experimentalThemes: {
				light: 'light-plus',
				dark: 'dark-plus'
			},
			wrap: true
		},
		remarkPlugins: [remarkBreaks, remarkDirective, remarkYoutube],
		rehypePlugins: [[rehypeExternalLinks, { rel: ['external', 'noopener', 'noreferrer'] }]]
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

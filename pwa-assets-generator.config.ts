/* eslint-disable @typescript-eslint/no-magic-numbers */

import { createAppleSplashScreens, defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
	images: ['public/icons/favicon.svg'],
	manifestIconsEntry: true,
	headLinkOptions: {
		basePath: '/icons/',
		xhtml: true
	},
	preset: {
		transparent: {
			sizes: [64, 192, 512],
			favicons: [[48, 'favicon.ico']],
			padding: 0
		},
		maskable: {
			sizes: [64, 192, 512],
			padding: 0,
			resizeOptions: { background: '#252525', fit: 'contain' }
		},
		apple: {
			sizes: [180],
			padding: 0,
			resizeOptions: { background: '#252525', fit: 'contain' }
		},
		appleSplashScreens: createAppleSplashScreens({
			padding: 0.3,
			resizeOptions: { background: '#f5f5f5', fit: 'contain' },
			darkResizeOptions: { background: '#252525', fit: 'contain' },
			linkMediaOptions: {
				log: true,
				addMediaScreen: true,
				basePath: '/icons/',
				xhtml: true
			}
		})
	}
});

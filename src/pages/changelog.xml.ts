import type { APIRoute } from 'astro';

import { marked } from 'marked';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';

import defaultImage from '../assets/images/logo-micro.png';

export const GET: APIRoute = async (context) => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;

	const blogImage = await getImage({ src: defaultImage, format: 'png', width: 512, height: 512 });

	return rss({
		title: "Marco Campos' Blog",
		description: 'A space where I talk about web development, Vue.js, Node.js, TypeScript, JavaScript',
		site: context.site ?? '',
		items: await Promise.all((await getCollection('changelog')).map(async (changelog) => {
			const versionNumber = changelog.id.replace('.md', '');
			const { versionName } = changelog.data;

			const item: RSSFeedItem = {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				title: `${versionNumber}${versionName ? ` (${versionName})` : ''}`,
				description: await marked(changelog.body),
				pubDate: changelog.data.date,
				link: new URL('/changelog', context.site).toString()
			};

			return item;
		})),
		stylesheet: '/changelog.xsl',
		customData: `
		<language>en-us</language>
		<image>
			<url>${new URL(blogImage.src, context.site).toString()}</url>
			<title>Marco Campos' Website Changelog</title>
			<description>Changelog (Version History) for Marco Campos' Website, containing all recent changes.</description>
			<link>http://madcampos.dev/changelog</link>
			<width>${blogImage.options.width}</width>
			<height>${blogImage.options.height}</height>
		</image>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<ttl>${ONE_WEEK_IN_MINUTES}</ttl>
	`
	});
};

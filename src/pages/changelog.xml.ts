import type { APIRoute } from 'astro';

import { marked } from 'marked';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';

import defaultImage from '../assets/images/logo-micro.png';

export const GET: APIRoute = async (context) => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;

	const siteImage = await getImage({ src: defaultImage, format: 'png', width: 512, height: 512 });

	return rss({
		title: "Marco Campos' Site Changelog",
		description: 'Changelog (Version History) for Marco Campos\' Website, containing all recent changes.',
		site: context.site ?? '',
		items: await Promise.all((await getCollection('changelog')).map(async (changelog) => {
			const versionNumber = changelog.id.replace('.md', '');
			const { versionName } = changelog.data;

			const item: RSSFeedItem = {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				title: `${versionNumber}${versionName ? ` (${versionName})` : ''}`,
				description: await marked(changelog.body),
				pubDate: changelog.data.date,
				link: new URL(`/changelog.xml#${versionNumber}`, context.site).toString()
			};

			return item;
		})),
		stylesheet: '/blog/feed.xsl',
		customData: `
		<language>en-us</language>
		<image>
			<url>${new URL(siteImage.src, context.site).toString()}</url>
			<title>Marco Campos' Website Changelog</title>
			<description>Changelog (Version History) for Marco Campos' Website, containing all recent changes.</description>
			<link>http://madcampos.dev/changelog.xml</link>
			<width>142</width>
			<height>116</height>
		</image>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<ttl>${ONE_WEEK_IN_MINUTES}</ttl>
	`
	});
};

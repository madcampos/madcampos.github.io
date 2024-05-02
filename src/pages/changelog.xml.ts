import type { APIRoute } from 'astro';

import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';

import { BLOG } from '../constants';

import { parseMarkdown } from '../utils/markdown';

import defaultImage from '../assets/images/logo/logo-micro.png';

export const GET: APIRoute = async (context) => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;

	const siteImage = await getImage({ src: defaultImage, format: 'png', width: 512, height: 512 });

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const baseUrl = new URL(context.site!);

	baseUrl.protocol = 'https:';

	return rss({
		title: "Marco Campos' Site Changelog",
		description: 'Changelog (Version History) for Marco Campos\' Website, containing all recent changes.',
		site: baseUrl.toString(),
		items: await Promise.all((await getCollection('changelog')).map(async (changelog) => {
			const versionNumber = changelog.id.replace('.md', '');
			const { versionName } = changelog.data;
			const content = await parseMarkdown(changelog.body);

			const item: RSSFeedItem = {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				title: `${versionNumber}${versionName ? ` (${versionName})` : ''}`,
				description: content,
				content,
				pubDate: changelog.data.date,
				link: new URL(`/changelog.xml#${versionNumber}`, baseUrl).toString()
			};

			return item;
		})),
		stylesheet: `${BLOG.url}/feed.xsl`,
		customData: `
		<language>en-us</language>
		<image>
			<url>${new URL(siteImage.src, baseUrl).toString()}</url>
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

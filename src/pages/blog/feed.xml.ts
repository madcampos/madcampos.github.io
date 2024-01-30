import type { APIRoute } from 'astro';

import { stat } from 'node:fs/promises';

import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getImage } from 'astro:assets';

import { BLOG_URL } from '../../constants';
import { listAllPosts } from '../../utils/post';

import defaultImage from '../../assets/images/logo-blog-micro.png';

export const GET: APIRoute = async (context) => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const TEN_KB_IN_BYTES = 10 * 1024;

	const blogImage = await getImage({ src: defaultImage, format: 'png', width: 512, height: 512 });
	const blogUrl = new URL(BLOG_URL, context.site).toString();

	const allPosts = await listAllPosts();

	return rss({
		title: "Marco Campos' Blog",
		description: 'A space where I talk about web development, Vue.js, Node.js, TypeScript, JavaScript',
		site: blogUrl,
		xmlns: {
			atom: 'http://www.w3.org/2005/Atom',
			media: 'http://search.yahoo.com/mrss/'
		},
		stylesheet: `${blogUrl}/feed.xsl`,
		customData: `
			<language>en-us</language>
			<atom:link href="${context.site?.toString() ?? ''}" rel="self" type="application/rss+xml" />
			<image>
				<url>${new URL(blogImage.src, context.site).toString()}</url>
				<title>Marco Campos' Blog</title>
				<link>${blogUrl}</link>
				<width>144</width>
				<height>144</height>
			</image>
			<pubDate>${new Date(allPosts[0]?.data.createdAt ?? new Date()).toUTCString()}</pubDate>
			<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
			<ttl>${ONE_WEEK_IN_MINUTES}</ttl>
			<generator>Astro</generator>
		`,
		items: await Promise.all(allPosts.map(async (post) => {
			let image;
			let imageSize = TEN_KB_IN_BYTES;

			if (post.data.image) {
				const sourceFilePath = post.data.image.src.replace(/^\/@fs/iu, '').replace(/\?.+$/iu, '');
				const buildFilePath = import.meta.url.replace(/\/dist\/.*$/iu, `/dist${sourceFilePath}`).replace(/^file:\/\//iu, '');

				image = await getImage({ src: post.data.image, format: 'png' });

				// If we are in dev mode, the paths will be diferent.
				// If we are in build mode, one will be part of the other.
				if (buildFilePath.includes(sourceFilePath)) {
					imageSize = (await stat(buildFilePath)).size;
				} else {
					imageSize = (await stat(sourceFilePath)).size;
				}
			}

			const item: RSSFeedItem = {
				title: post.data.title,
				description: post.data.summary,
				pubDate: post.data.createdAt,
				categories: post.data.tags,
				link: `${blogUrl}${post.url}`,
				...(image && {
					enclosure: {
						url: new URL(image.src, context.site).toString(),
						type: 'image/png',
						length: imageSize
					},
					customData: `
						<media:content
							url="${new URL(image.src, context.site).toString()}"
							type="image/png"
							medium="image"
							height="${image.options.height ?? '512'}"
							width="${image.options.width ?? '512'}"
						/>
						<media:description type="plain">${post.data.imageAlt ?? ''}</media:description>
					`
				})
			};

			return item;
		}))
	});
};

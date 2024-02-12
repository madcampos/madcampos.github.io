import type { APIRoute } from 'astro';

import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getImage } from 'astro:assets';

import { BLOG_DESCRIPTION, BLOG_LOGO_MICRO_ALT, BLOG_URL } from '../../constants';
import { listAllPosts } from '../../utils/post';

import defaultImage from '../../assets/images/logo-blog-micro.png';
import { parseMarkdown } from '../../utils/markdown';

export const GET: APIRoute = async (context) => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;

	const blogImage = await getImage({ src: defaultImage, format: 'png', width: 512, height: 512 });

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const baseUrl = new URL(context.site!);

	baseUrl.protocol = 'https:';

	const blogUrl = new URL(BLOG_URL, baseUrl).toString();

	const allPosts = await listAllPosts();

	return rss({
		title: "Marco Campos' Blog",
		description: BLOG_DESCRIPTION,
		site: blogUrl,
		xmlns: {
			atom: 'http://www.w3.org/2005/Atom',
			media: 'http://search.yahoo.com/mrss/',
			dc: 'http://purl.org/dc/elements/1.1/'
		},
		stylesheet: `${blogUrl}/feed.xsl`,
		customData: `
			<language>en-us</language>
			<atom:link href="${new URL(blogImage.src, baseUrl).toString()}" rel="self" type="application/rss+xml" />
			<image>
				<url>${new URL(blogImage.src, baseUrl).toString()}</url>
				<title>Marco Campos' Blog</title>
				<description>${BLOG_LOGO_MICRO_ALT}</description>
				<link>${blogUrl}</link>
				<width>142</width>
				<height>116</height>
			</image>
			<pubDate>${new Date(allPosts[0]?.data.createdAt ?? new Date()).toUTCString()}</pubDate>
			<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
			<ttl>${ONE_WEEK_IN_MINUTES}</ttl>
			<generator>Astro</generator>
			<dc:creator>Marco Campos</dc:creator>
		`,
		items: await Promise.all(allPosts.map(async (post) => {
			let image;

			if (post.data.image) {
				image = await getImage({ src: post.data.image, format: 'png' });
			}

			const content = await parseMarkdown(post.body);

			const item: RSSFeedItem = {
				title: post.data.title,
				description: post.data.summary,
				pubDate: post.data.createdAt,
				categories: post.data.tags,
				link: `${blogUrl}${post.url}`,
				content,
				...(image && {
					enclosure: {
						url: new URL(image.src, baseUrl).toString(),
						type: 'image/png',
						length: 0
					},
					customData: `
						<media:content
							url="${new URL(image.src, baseUrl).toString()}"
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

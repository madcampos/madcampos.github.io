import type { BlogConfig } from '.';
import type { BlogPost } from './post';

export function generateRssFeed(config: BlogConfig, posts: BlogPost[]) {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;

	let rssString = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel>
		<title>${config.title}</title>
		<link>${config.url}</link>
		<description>${config.description}</description>
		<language>en-us</language>
		<pubDate>${new Date().toUTCString()}</pubDate>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<ttl>${ONE_WEEK_IN_MINUTES}</ttl>`;

	if (config.rssIconUrl) {
		rssString += `<image>
			<url>${config.rssIconUrl}</url>
			<title>${config.title}</title>
			<link>${config.url}</link>
			<width>512</width>
			<height>512</height>
		</image>`;
	}

	posts.forEach((post) => {
		rssString += `
		<item>
			<title>${post.title}</title>
			<link>${post.url}</link>
			<guid>${post.url}</guid>
			<pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
			<description><![CDATA[${post.summary}]]></description>`;

			if (post.mainImage) {
				rssString += `<enclosure url="${post.mainImage.url}" type="${post.mainImage.url.endsWith('.png') ? 'image/png' : 'image/jpeg'}" />`;
			}

			if (post.tags) {
				post.tags.forEach((tag) => {
					rssString += `<category>${tag}</category>`;
				});
			}

		rssString += '</item>';
	});

	rssString += '</channel></rss>';

	return rssString.replaceAll(/\n+|\t+/gui, '');
}

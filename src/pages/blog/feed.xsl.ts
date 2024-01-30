import type { APIRoute } from 'astro';

import feedXsl from '../../assets/feed.xsl?raw';

export const GET: APIRoute = () => {
	const body = feedXsl.replaceAll(/\t|\n/giu, '').replaceAll(/\s+/giu, ' ');

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
};

import { marked } from 'marked';


export async function parseMarkdown(content: string) {
	return marked(content, { gfm: true, breaks: true });
}

export async function extractLinks(content: string) {
	const links: string[] = [];
	const renderer = new marked.Renderer();

	renderer.link = (href) => {
		links.push(href);

		return '';
	};

	await marked(content, { gfm: true, breaks: true, renderer });

	return links;
}

export function getExternalLinks(links: string[], internalOrigin: string) {
	const externalLinks = links.filter((link) => {
		const isAbsolute = link.startsWith('/');
		const isRelative = link.startsWith('../') || link.startsWith('./');
		const isAnchor = link.startsWith('#');
		const isProtocol = link.includes('://');
		const isInternal = !isAbsolute && !isRelative && !isAnchor;
		const isExternal = !isInternal && isProtocol && !link.startsWith(internalOrigin);

		return isExternal;
	});

	return externalLinks;
}

import type { TemplateDelegate as HandlebarsTemplateDelegate } from 'handlebars';
import type { BlogConfig } from '.';
import type { BlogPost } from './post';

import { createHtmlFile } from './file-write';

export interface PageMetadata {
	/**
	 * The title for this page.
	 * @example 'Posts from 2023'
	 * @example 'Posts tagged with "javascript"'
	 */
	title: string,
	/** The base absolute url for this page. */
	url: string,
	/** The destination directory where the page will be created, relative to the project root. */
	destPath: string,
	/** The page slug to be used when adding it to rollup's input list. */
	slug: string,
	/** The page description. */
	description?: string
}

interface PageTemplateData extends PageMetadata {
	config: BlogConfig,
	posts: BlogPost[],
	paginationHtml: string
}

function generatePaginationHtml(_config: BlogConfig, pageMetadata: PageMetadata, maxPages: number, selectedPage: number) {
	if (maxPages === 1) {
		return '';
	}

	const TRIM_PAGE_NUMBER = 2;
	const firstPageInNav = Math.max(1, selectedPage - TRIM_PAGE_NUMBER);
	const lastPageInNav = Math.min(maxPages, selectedPage + TRIM_PAGE_NUMBER);

	const links = Array(lastPageInNav - firstPageInNav + 1).fill(null).map((_, i) => {
		const currentPageNumber = firstPageInNav + i;
		const href = currentPageNumber === 1 ? '' : `page-${currentPageNumber}/`;

		return `<li><a href="/${pageMetadata.url}/${href}">${currentPageNumber}</a></li>`;
	});

	const nextPageLink = selectedPage + 1 > maxPages ? '' : `<a href="/${pageMetadata.url}/page-${selectedPage + 1}/">Next</a>`;
	let previousPageLink = '';

	if (selectedPage - 1 === 1) {
		previousPageLink = `<a href="/${pageMetadata.url}/">Previous</a>`;
	} else if (selectedPage - 1 > 1) {
		previousPageLink = `<a href="/${pageMetadata.url}/page-${selectedPage - 1}/">Previous</a>`;
	}

	return `<nav>
		${previousPageLink}
		<ol>
			${links.join('\n')}
		</ol>
		${nextPageLink}
	</nav>`;
}

export async function generatePaginatedList(config: BlogConfig, pageMetadata: PageMetadata, template: HandlebarsTemplateDelegate<PageTemplateData>, posts: BlogPost[]) {
	const pagesList: Record<string, string> = {};
	const maxPages = Math.ceil(posts.length / config.pagination);

	for (let page = 1; page <= maxPages; page += 1) {
		const paginationHtml = posts.length > config.pagination ? generatePaginationHtml(config, pageMetadata, maxPages, page) : '';
		const start = (page - 1) * config.pagination;
		const end = page * config.pagination;
		const postsOnPage = posts.slice(start, end);
		const pageUrl = page === 1 ? `${pageMetadata.url}/` : `${pageMetadata.url}/page-${page}/`;
		const pagePath = page === 1 ? `${pageMetadata.destPath}/` : `${pageMetadata.destPath}/page-${page}/`;

		const content = template({
			...pageMetadata,
			url: pageUrl.replace(/(?<!:)\/\/+/giu, '/'),
			destPath: pagePath,
			config,
			posts: postsOnPage,
			paginationHtml
		});

		// eslint-disable-next-line no-await-in-loop
		pagesList[`blog-${pageMetadata.slug}-${page}`] = await createHtmlFile(pagePath, content);
	}

	return pagesList;
}

export async function generatePagesByDate(config: BlogConfig, posts: BlogPost[], template: HandlebarsTemplateDelegate<PageTemplateData>) {
	const postsByDate = posts.reduce((years, post) => {
		if (!years[post.postDate.year]) {
			years[post.postDate.year] = {};
		}

		if (!years[post.postDate.year][post.postDate.month]) {
			years[post.postDate.year][post.postDate.month] = [];
		}

		years[post.postDate.year][post.postDate.month].push(post);

		return years;
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	}, {} as Record<string, Record<string, BlogPost[]>>);

	const pages: Record<string, string> = {};

	for await (const [year, months] of Object.entries(postsByDate)) {
		const yearPages = await generatePaginatedList(config, {
			title: `Posts from ${year}`,
			url: new URL(year, config.url).toString(),
			destPath: `${config.postsDestDir}/${year}`,
			slug: `year-${year}`
		}, template, Object.values(months).flat());

		Object.assign(pages, yearPages);

		for await (const [month, monthPosts] of Object.entries(months)) {
			const monthPages = await generatePaginatedList(config, {
				title: `Posts from ${year}-${month}`,
				url: new URL(`${year}/${month}`, config.url).toString(),
				destPath: `${config.postsDestDir}/${year}/${month}`,
				slug: `year-${year}-month-${month}`
			}, template, monthPosts);

			Object.assign(pages, monthPages);
		}
	}

	return pages;
}

export async function generatePagesByTag(config: BlogConfig, posts: BlogPost[], template: HandlebarsTemplateDelegate<PageTemplateData>) {
	const postsByTag = posts.reduce((tags, post) => {
		if (!post.tags) {
			return tags;
		}

		post.tags.forEach((tag) => {
			if (!tags[tag]) {
				tags[tag] = [];
			}

			tags[tag].push(post);
		});

		return tags;
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	}, {} as Record<string, BlogPost[]>);


	const pages: Record<string, string> = {};

	for await (const [tag, tagedPosts] of Object.entries(postsByTag)) {
		const tagPages = await generatePaginatedList(config, {
			title: `Posts tagged with "${tag}"`,
			url: new URL(tag, config.url).toString(),
			destPath: `${config.postsDestDir}/${tag}`,
			slug: `tag-${tag}`
		}, template, tagedPosts);

		Object.assign(pages, tagPages);
	}

	return pages;
}

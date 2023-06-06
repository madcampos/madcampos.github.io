import type { marked } from 'marked';

import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import { createFile } from './file-write';
import { getFiles, removeDirectory } from './directory-walk';
import { generateRssFeed } from './rss';
import { generateBlogPostPage, getPostContent } from './post';
import { generatePagesByDate, generatePagesByTag, generatePaginatedList } from './page';

export interface BlogConfig {
	/**
	 * The blog title.
	 * @default 'Blog'
	 */
	title: string,
	/**
	 * The blog description.
	 * @default ''
	 */
	description: string,
	/**
	 * The blog main url.
	 * @default ''
	 * @example 'https://example.com/blog'
	 */
	url: string,

	/**
	 * The path to the rss file, relative to the project root.
	 * @default 'public/blog/rss.xml'
	 */
	rssPath: string,
	/** The url to an image that will be used as the icon for the rss feed. */
	rssIconUrl?: string,

	/**
	 * The path to the directory where the blog posts are located, relative to the project root.
	 * @default 'blog'
	 */
	postsSrcDir: string,

	/**
	 * The path to the directory where the generated posts will be located, relative to the project root.
	 * @default 'src/blog'
	 */
	postsDestDir: string,

	/** The paths to the templates for the blog pages. */
	templatePaths: {
		/**
		 * The path to the home page template, relative to the project root.
		 * @default 'src/templates/blog/post.html'
		 */
		home: string,
		/**
		 * The path to the post page template, relative to the project root.
		 * @default 'src/templates/blog/post.html'
		 */
		post: string,
		/**
		 * The path to the posts list page template, relative to the project root.
		 * @default 'src/templates/blog/posts.html'
		 */
		posts: string
	},

	/**
	 * The number of posts to show per page.
	 * @default 30
	 */
	pagination: number,

	/** Options to pass down to the marked parser. */
	markedOptions: marked.MarkedOptions
}

async function getBlogPosts(config: BlogConfig, postsDir: string) {
	const postFiles = await getFiles(postsDir);

	return Promise.all(postFiles.map(async (postPath) => getPostContent(postPath, config)));
}

async function getCompiledTemplates(config: BlogConfig) {
	handlebars.registerHelper('formatDate', (dateString) => new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(dateString)));

	return {
		post: handlebars.compile(await readFile(config.templatePaths.post, { encoding: 'utf8' })),
		home: handlebars.compile(await readFile(config.templatePaths.home, { encoding: 'utf8' })),
		posts: handlebars.compile(await readFile(config.templatePaths.posts, { encoding: 'utf8' }))
	};
}

export async function createBlogPages(config: Partial<BlogConfig> = {}) {
	const parsedConfig: BlogConfig = {
		title: 'Blog',
		description: '',
		url: '',

		postsSrcDir: 'blog',
		postsDestDir: 'src/blog',
		pagination: 30,

		rssPath: 'public/blog/rss.xml',

		...config,
		templatePaths: {
			posts: 'src/templates/blog/posts.html',
			post: 'src/templates/blog/post.html',
			home: 'src/templates/blog/home.html',
			...config.templatePaths
		},

		markedOptions: {
			async: true,
			breaks: true,
			gfm: true,
			headerIds: true,
			headerPrefix: '',
			langPrefix: '',
			silent: true,
			mangle: true,
			// @ts-expect-error
			smartLists: true,
			smartypants: true,
			sanitize: true,
			...config.markedOptions
		}
	};

	const templates = await getCompiledTemplates(parsedConfig);

	const posts = await getBlogPosts(parsedConfig, parsedConfig.postsSrcDir);

	await removeDirectory(parsedConfig.postsDestDir);

	await createFile(parsedConfig.rssPath, generateRssFeed(parsedConfig, posts));

	const pages: Record<string, string> = {
		...await generatePaginatedList(parsedConfig, {
			title: parsedConfig.title,
			url: parsedConfig.url,
			destPath: parsedConfig.postsDestDir,
			slug: 'home',
			description: parsedConfig.description
		}, templates.home, posts)
	};
	const postPages = await Promise.all(posts.map(async (post) => generateBlogPostPage(parsedConfig, templates.post, post)));

	Object.assign(pages, Object.fromEntries(postPages));
	Object.assign(pages, await generatePagesByDate(parsedConfig, posts, templates.posts));
	Object.assign(pages, await generatePagesByTag(parsedConfig, posts, templates.posts));

	return pages;
}

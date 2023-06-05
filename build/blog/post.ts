import type { TemplateDelegate as HandlebarsTemplateDelegate } from 'handlebars';
import type { BlogConfig } from '.';

import { readFile } from 'fs/promises';
import { marked } from 'marked';
import shiki from 'shiki';
import { basename, dirname } from 'path';
import { copyFile, createHtmlFile } from './file-write';

export interface BlogPost {
	/** The post title that will be displayed as the top of the post page or as the heading on lists. */
	title: string,
	/** The slug string to represent this post. */
	slug: string,
	/** The full url for the post. */
	url: string,

	/** The filename of the post file. */
	filename: string,
	/** The path where the original post file is located. */
	srcPath: string,
	/** The path where the post file should be created. */
	destPath: string,

	/** A summary for the post that will show in list pages. */
	summary: string,
	/** The full post content. */
	content: string,

	/** The post main "hero" image. */
	mainImage?: {
		/** The main image url. */
		url: string,
		/** The main image alt text. */
		alt?: string
	},

	/** The post images paths. */
	images: string[],

	/** The post tags. */
	tags?: string[],

	/** The post date as year, month and day. */
	postDate: {
		/** The post year. */
		year: string,
		/** The post month. */
		month: string,
		/** The post day. */
		day: string
	},

	/** The post creation date. */
	createdAt: string,
	/** The post last update date. */
	updatedAt?: string
}

interface PostTemplateData extends BlogPost {
	config: BlogConfig
}

function extractPostMetadata(postMetadata: string, config: BlogConfig, postUrl: string) {
	const metadata = postMetadata.replaceAll(/^\s*?<!--\s*|\s*?-->\s*?$/gui, '');

	const [, descriptionMatch] = (/^\s*?description:\s*(.*?)\s*$/uim).exec(metadata) ?? [];
	const [, summaryMatch] = (/^\s*?summary:\s*(.*?)\s*$/uim).exec(metadata) ?? [];
	const summary = marked.parseInline(descriptionMatch ?? summaryMatch ?? '', { ...config.markedOptions, async: false, baseUrl: postUrl });

	const [, tagsMatch] = (/^\s*?tags:\s*(.*?)\s*$/uim).exec(metadata) ?? [];
	const tags: string[] = [...tagsMatch.split(',').map((tag) => tag.trim())];

	const [, updatedMatch] = (/^\s*?updated:\s*(.*?)\s*$/uim).exec(metadata) ?? [];
	const [, updatedAtMatch] = (/^\s*?updated_at:\s*(.*?)\s*$/uim).exec(metadata) ?? [];
	const updatedAt = updatedMatch ?? updatedAtMatch;

	return {
		summary,
		tags,
		updatedAt
	};
}

export async function getPostContent(postPath: string, config: BlogConfig) {
	const srcPath = dirname(postPath);
	const post = await readFile(postPath, { encoding: 'utf8' });

	const date = basename(srcPath);
	const [year, month, day] = date.split('-');
	const slug = basename(postPath, '.md');

	const destPath = `${config.postsDestDir}/${year}/${month}/${slug}/`;
	const url = new URL(`${year}/${month}/${slug}/`, config.url).toString();

	const highlighter = await shiki.getHighlighter({
		theme: 'dark-plus',
		langs: ['typescript', 'ts', 'html', 'javascript', 'js', 'json', 'css', 'markdown', 'md', 'bash', 'shell', 'console', 'fish', 'sh', 'handlebars', 'hbs', 'jsonc', 'ini', 'diff', 'docker', 'dockerfile', 'powershell', 'ps1', 'ps', 'vue', 'vue-html']
	});

	const markedOptions: marked.MarkedOptions = {
		...config.markedOptions,
		baseUrl: url,
		highlight: (code, lang) => highlighter.codeToHtml(code, { lang })
	};

	const lex = marked.lexer(post, markedOptions);
	const content = marked.parser(lex, markedOptions);

	const images: string[] = [];
	let title = slug;
	let image: string | undefined;
	let imageAlt: string | undefined;
	let summary = '';
	let tags: string[] = [];
	const createdAt = `${date}T00:00:00.000Z`;
	let updatedAt: string | undefined;
	let hasMetadata = false;

	marked.walkTokens(lex, (token) => {
		if (token.type === 'heading' && token.depth === 1 && title === slug) {
			title = token.text;
		}

		if (token.type === 'image' && !image) {
			image = token.href;
			imageAlt = token.title ?? token.text;
		}

		if (token.type === 'image') {
			images.push(token.href);
		}

		if (token.type === 'html' && token.text.startsWith('<!--') && !hasMetadata) {
			const { summary: postSummary, tags: postTags, updatedAt: postUpdatedAt } = extractPostMetadata(token.text, config, url);

			summary = postSummary;
			tags = postTags;
			updatedAt = postUpdatedAt;

			hasMetadata = true;
		}
	});

	const postContent: BlogPost = {
		title,
		slug,
		filename: basename(postPath),
		srcPath,
		destPath,
		url,
		createdAt,
		updatedAt,
		postDate: {
			year,
			month,
			day
		},
		summary,
		content,
		...(image && {
			mainImage: {
				url: image,
				alt: imageAlt
			}
		}),
		images,
		tags
	};

	return postContent;
}

export async function generateBlogPostPage(config: BlogConfig, template: HandlebarsTemplateDelegate<PostTemplateData>, postData: BlogPost) {
	const post = template({ config, ...postData });

	const postPath = await createHtmlFile(postData.destPath, post);

	await Promise.all(postData.images.map(async (imagePath) => {
		if (imagePath.startsWith('./')) {
			const imageFilePath = imagePath.replace(/^.\//iu, '');

			await copyFile(`${postData.srcPath}/${imageFilePath}`, `${postData.destPath}/${imageFilePath}`);
		}
	}));

	return [`${postData.createdAt}-${postData.slug}`, postPath];
}

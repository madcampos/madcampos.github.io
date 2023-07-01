import type { TemplateDelegate as HandlebarsTemplateDelegate } from 'handlebars';
import type { BlogConfig } from '.';

import { readFile } from 'fs/promises';
import { basename, dirname } from 'path';

import { marked } from 'marked';
import shiki from 'shiki';
import { parse as frontmatter } from 'ultramatter';

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
	/** The path for where assets for this post will go, like images or media */
	assetsPath: string,

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

interface PostMetadata {
	title?: string,
	slug?: string,

	image?: string,
	heroImage?: string,
	hero_image?: string,
	hero?: string,
	mainImage?: string,
	main_image?: string,

	imageAlt?: string,
	image_alt?: string,
	heroImageAlt?: string,
	hero_image_alt?: string,
	heroAlt?: string,
	hero_alt?: string,
	mainImageAlt?: string,
	main_image_alt?: string,

	createdAt?: string,
	created_at?: string,
	created?: string,

	updatedAt?: string,
	updated_at?: string,
	updated?: string,

	summary?: string,
	description?: string,
	excerpt?: string,

	tags?: string[]
}

function getTitleFromMetadata(slug: string, metadata?: PostMetadata) {
	return metadata?.title ?? slug;
}

function getSummaryFromMetadata(metadata?: PostMetadata) {
	return metadata?.summary ?? metadata?.description ?? metadata?.excerpt ?? '';
}

function getHeroImageFromMetadata(metadata?: PostMetadata) {
	return metadata?.image ?? metadata?.heroImage ?? metadata?.hero_image ?? metadata?.hero ?? metadata?.mainImage ?? metadata?.main_image;
}

function getHeroImageAltTextFromMetadata(metadata?: PostMetadata) {
	// eslint-disable-next-line max-len
	return metadata?.imageAlt ?? metadata?.image_alt ?? metadata?.heroImageAlt ?? metadata?.hero_image_alt ?? metadata?.heroAlt ?? metadata?.hero_alt ?? metadata?.mainImageAlt ?? metadata?.main_image_alt;
}

function getCreatedAtDateFromMetadata(date: string, metadata?: PostMetadata) {
	return metadata?.createdAt ?? metadata?.created_at ?? metadata?.created ?? `${date}T00:00:00.000Z`;
}

function getUpdatedAtDateFromMetadata(createdAt: string, metadata?: PostMetadata) {
	return metadata?.updatedAt ?? metadata?.updated_at ?? metadata?.updated ?? createdAt;
}

export async function getPostContent(postPath: string, config: BlogConfig) {
	const srcPath = dirname(postPath);
	const rawPostText = await readFile(postPath, { encoding: 'utf8' });

	const date = basename(srcPath);
	const [year, month, day] = date.split('-');
	const slug = basename(postPath, '.md');

	const destPath = `${config.postsDestDir}/${year}/${month}/${slug}/`;
	const assetsPath = `${config.assetsDir}/${year}/${month}/${slug}/`;
	const url = new URL(`${year}/${month}/${slug}/`, config.url).toString();

	const highlighter = await shiki.getHighlighter({
		theme: 'dark-plus',
		langs: ['typescript', 'ts', 'html', 'javascript', 'js', 'json', 'css', 'markdown', 'md', 'bash', 'shell', 'console', 'fish', 'sh', 'handlebars', 'hbs', 'jsonc', 'ini', 'diff', 'docker', 'dockerfile', 'powershell', 'ps1', 'ps', 'vue', 'vue-html']
	});

	const markedOptions: marked.MarkedOptions = {
		...config.markedOptions,
		baseUrl: url,
		highlight: (code, lang) => {
			const formattedCode = highlighter.codeToHtml(code, { lang });

			return formattedCode.replace(/^<pre class="shiki.*?<code>/iu, '').replace(/<\/pre><\/code>/iu, '');
		}
	};

	const { frontmatter: metadata, content: postText }: { frontmatter?: PostMetadata, content: string } = frontmatter(rawPostText);
	const lex = marked.lexer(postText, markedOptions);
	const content = marked.parser(lex, markedOptions);

	const images: string[] = [];
	let title = getTitleFromMetadata(slug, metadata);
	const image = getHeroImageFromMetadata(metadata);
	const imageUrl = image && new URL(image, url).toString();
	const imageAlt = getHeroImageAltTextFromMetadata(metadata);
	const createdAt = getCreatedAtDateFromMetadata(date, metadata);

	if (image) {
		images.push(image);
	}

	marked.walkTokens(lex, (token) => {
		if (token.type === 'heading' && token.depth === 1 && title === slug) {
			title = token.text;
		}

		if (token.type === 'image') {
			images.push(token.href);
		}
	});

	const postContent: BlogPost = {
		title,
		slug,
		filename: basename(postPath),
		srcPath,
		destPath,
		assetsPath,
		url,
		createdAt,
		updatedAt: getUpdatedAtDateFromMetadata(createdAt, metadata),
		postDate: {
			year,
			month,
			day
		},
		summary: getSummaryFromMetadata(metadata),
		content,
		...(imageUrl && {
			mainImage: {
				url: imageUrl,
				alt: imageAlt
			}
		}),
		images,
		tags: metadata?.tags ?? []
	};

	return postContent;
}

export async function generateBlogPostPage(config: BlogConfig, template: HandlebarsTemplateDelegate<PostTemplateData>, postData: BlogPost) {
	const post = template({ config, ...postData });

	const postPath = await createHtmlFile(postData.destPath, post);

	await Promise.all(postData.images.map(async (imagePath) => {
		if (imagePath.startsWith('./')) {
			const imageFilePath = imagePath.replace(/^.\//iu, '');

			await copyFile(`${postData.srcPath}/${imageFilePath}`, `${postData.assetsPath}/${imageFilePath}`);
		}
	}));

	return [`${postData.createdAt}-${postData.slug}`, postPath];
}

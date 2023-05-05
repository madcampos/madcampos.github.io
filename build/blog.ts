import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { marked } from 'marked';

interface BlogConfig {
	postsDir: string,
	blogPath: string,
	homePageTemplate: string,
	postCardTemplate: string,
	postsPageTemplate: string,
	paginatedTemplate: string,
	pagination: number,
	markedOptions: marked.MarkedOptions,
	blogMetadata: {
		title: string,
		description: string,
		url: string,
		imageUrl?: string
	}
}

interface BlogPost {
	title: string,
	slug: string,
	date: string,
	year: string,
	month: string,
	excerpt: string,
	content: string,
	tags?: string[],
	image?: string,
	imageAlt?: string
}

interface PageMetadata {
	title: string,
	basePath: string,
	slug: string,
	description?: string,
	template?: string
}

async function getFiles(dir: string) {
	const entries = await readdir(dir, { withFileTypes: true });

	const files: string[] = [];

	for await (const entry of entries) {
		const path = `${dir}/${entry.name}`;

		if (entry.isDirectory()) {
			files.push(...await getFiles(path));
		} else {
			files.push(path);
		}
	}

	return files;
}

async function getBlogPosts(config: BlogConfig, postsDir: string) {
	const postFiles = await getFiles(postsDir);

	return Promise.all(postFiles.map(async (postPath) => {
		const [fileName, date] = postPath.split('/').reverse();
		const slug = fileName.replace(/.md$/ui, '');
		const post = await readFile(postPath, { encoding: 'utf8' });

		const lex = marked.lexer(post, config.markedOptions);
		const content = marked.parser(lex, config.markedOptions);

		let title = slug;
		let image: string | undefined;
		let imageAlt: string | undefined;
		let excerpt = '';
		let tags: string[] = [];
		let hasMetadata = false;

		marked.walkTokens(lex, (token) => {
			if (token.type === 'heading' && token.depth === 1 && title === slug) {
				title = token.text;
			}

			if (token.type === 'image' && !image) {
				image = token.text;
				imageAlt = token.title;
			}

			if (token.type === 'image') {
				images.push(token.text);
			}

			if (token.type === 'html' && token.text.startsWith('<!--') && !hasMetadata) {
				const metadata = token.text.replace(/\s*?-->\s*?$/ui, '').replace(/^\s*?<!--\s*?/ui, '');
				const [, descriptionMatch] = (/^\s*?description:\s*(.*?)\s*$/uim).exec(metadata) ?? [];
				const [, excerptMatch] = (/^\s*?excerpt:\s*(.*?)\s*$/uim).exec(metadata) ?? [];
				const [, tagsMatch] = (/^\s*?tags:\s*(.*?)\s*$/uim).exec(metadata) ?? [];
				const excerptLex = marked.lexer(descriptionMatch ?? excerptMatch ?? '', config.markedOptions);

				excerpt = marked.parser(excerptLex, config.markedOptions);

				if (tagsMatch) {
					tags = tagsMatch.split(',').map((tag) => tag.trim());
				}

				hasMetadata = true;
			}
		});

		const postContent: BlogPost = {
			title,
			slug,
			date,
			year: date.split('-')[0],
			month: date.split('-')[1],
			excerpt,
			content,
			image,
			tags
		};

		return postContent;
	}));
}

async function createFile(partialPath: string, contents: string) {
	const folderPath = `src/${partialPath}`;
	const filePath = `${folderPath}/index.html`;

	await mkdir(folderPath, { recursive: true });
	await writeFile(filePath, contents, { encoding: 'utf8' });

	return filePath;
}

async function generateBlogPostPage(config: BlogConfig, { title, slug, year, month, date, content, excerpt, tags, image, imageAlt }: BlogPost) {
	const postDir = `${config.blogPath}/${year}/${month}/${slug}`;
	const filePath = `${postDir}/index.html`;

	const templateContents = await readFile(config.postsPageTemplate, { encoding: 'utf8' });

	const post = templateContents
		.replaceAll('{{ TITLE }}', title)
		.replaceAll('{{ SLUG }}', slug)
		.replaceAll('{{ BLOG_PATH }}', config.blogPath)
		.replaceAll('{{ POST_PATH }}', postDir)
		.replaceAll('{{ IMAGE }}', image ?? '')
		.replaceAll('{{ IMAGE_ALT }}', imageAlt ?? '')
		.replaceAll('{{ TAGS }}', (tags ?? []).join(', '))
		.replaceAll('{{ DATE }}', date)
		.replaceAll('{{ EXCERPT }}', excerpt)
		.replaceAll('{{ CONTENT }}', content);

	const postPath = await createFile(postDir, post);

	return [`${date}-${slug}`, `src/${filePath}`];
}

function generateBlogPostCard({ title, slug, date, year, month, excerpt }: BlogPost, blogPath: string, template: string) {
	const postDir = `${blogPath}/${year}/${month}/${slug}`;

	return template
		.replaceAll('{{ TITLE }}', title)
		.replaceAll('{{ SLUG }}', slug)
		.replaceAll('{{ BLOG_PATH }}', blogPath)
		.replaceAll('{{ POST_PATH }}', postDir)
		.replaceAll('{{ DATE }}', date)
		.replaceAll('{{ EXCERPT }}', excerpt);
}

function generatePaginationHtml(config: BlogConfig, pageMetadata: PageMetadata, length: number, selectedPage: number) {
	// TODO: implement

	return '';
}

async function generatePaginatedList(config: BlogConfig, pageMetadata: PageMetadata, posts: BlogPost[]) {
	const templateContents = await readFile(pageMetadata.template ?? config.paginatedTemplate, { encoding: 'utf8' });
	const postCardContents = await readFile(config.postCardTemplate, { encoding: 'utf8' });

	const pagesList: Record<string, string> = {};
	const maxPages = Math.ceil(posts.length / config.pagination);

	for (let page = 1; page <= maxPages; page += 1) {
		const paginationHtml = posts.length > config.pagination ? generatePaginationHtml(config, pageMetadata, maxPages, page) : '';
		const start = (page - 1) * config.pagination;
		const end = page * config.pagination;
		const postsOnPage = posts.slice(start, end);
		const pagePath = page === 1 ? pageMetadata.basePath : `${pageMetadata.basePath}/page-${page}`;

		const content = templateContents
			.replaceAll('{{ BLOG_PATH }}', config.blogPath)
			.replaceAll('{{ TITLE }}', pageMetadata.title)
			.replaceAll('{{ DESCRIPTION }}', pageMetadata.description ?? '')
			.replaceAll('{{ PAGE_PATH }}', pagePath)
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			.replace('{{ POSTS }}', postsOnPage.map((post) => generateBlogPostCard(post, config.blogPath, postCardContents)).join('\n'))
			.replaceAll('{{ PAGINATION }}', paginationHtml);

		// eslint-disable-next-line no-await-in-loop
		pagesList[`blog-${pageMetadata.slug}-${page}`] = await createFile(pagePath, content);
	}

	return pagesList;
}

function generateRssFeed(config: BlogConfig, posts: BlogPost[]) {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;

	let rssString = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel>
		<title>${config.blogMetadata.title}</title>
		<link>${config.blogMetadata.url}</link>
		<description>${config.blogMetadata.description}</description>
		<language>en-us</language>
		<pubDate>${new Date().toUTCString()}</pubDate>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<ttl>${ONE_WEEK_IN_MINUTES}</ttl>`;

	if (config.blogMetadata.imageUrl) {
		rssString += `<image>
			<url>${config.blogMetadata.imageUrl}</url>
			<title>${config.blogMetadata.title}</title>
			<link>${config.blogMetadata.url}</link>
			<width>512</width>
			<height>512</height>
		</image>`;
	}

	posts.forEach((post) => {
		rssString += `
		<item>
			<title>${post.title}</title>
			<link>${config.blogMetadata.url}/${post.year}/${post.month}/${post.slug}</link>
			<guid>${config.blogMetadata.url}/${post.year}/${post.month}/${post.slug}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<description><![CDATA[${post.excerpt}]]></description>`;

			if (post.image) {
				rssString += `<enclosure url="${post.image}" type="${post.image.endsWith('.png') ? 'image/png' : 'image/jpeg'}" />`;
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

export async function createBlogPages(config: Partial<BlogConfig> = {}) {
	const parsedConfig: BlogConfig = {
		postsDir: 'blog',
		blogPath: 'blog',
		postsPageTemplate: 'src/templates/blog/post.html',
		postCardTemplate: 'src/templates/blog/post-card.html',
		homePageTemplate: 'src/templates/blog/home.html',
		paginatedTemplate: 'src/templates/blog/paginated.html',
		pagination: 30,
		markedOptions: {
			async: true,
			breaks: true,
			gfm: true,
			headerIds: true,
			mangle: true,
			smartLists: true,
			smartypants: true
		},
		blogMetadata: {
			title: 'Blog',
			description: '',
			url: ''
		},
		...config
	};

	const posts = await getBlogPosts(parsedConfig, parsedConfig.postsDir);

	await mkdir('public/blog', { recursive: true });
	await writeFile('public/blog/rss.xml', generateRssFeed(parsedConfig, posts), { encoding: 'utf8' });

	const pages: Record<string, string> = {
		...await generatePaginatedList(parsedConfig, {
			title: 'Blog',
			basePath: parsedConfig.blogPath,
			slug: 'home',
			description: 'Blog about web development, programming and other random thoughts',
			template: parsedConfig.homePageTemplate
		}, posts),

		...Object.fromEntries(await Promise.all(posts.map(async (post) => generateBlogPostPage(parsedConfig, post))))
	};

	const postsByDate = posts.reduce((years, post) => {
		if (!years[post.year]) {
			years[post.year] = {};
		}

		if (!years[post.year][post.month]) {
			years[post.year][post.month] = [];
		}

		years[post.year][post.month].push(post);

		return years;
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	}, {} as Record<string, Record<string, BlogPost[]>>);

	for await (const [year, months] of Object.entries(postsByDate)) {
		const yearPages = await generatePaginatedList(parsedConfig, {
			title: `Posts from ${year}`,
			basePath: `${parsedConfig.blogPath}/${year}`,
			slug: `year-${year}`
		}, Object.values(months).flat());

		Object.assign(pages, yearPages);

		for await (const [month, monthPosts] of Object.entries(months)) {
			const monthPages = await generatePaginatedList(parsedConfig, {
				title: `Posts from ${year}-${month}`,
				basePath: `${parsedConfig.blogPath}/${year}/${month}`,
				slug: `year-${year}-month-${month}`
			}, monthPosts);

			Object.assign(pages, monthPages);
		}
	}

	const tagPosts = posts.reduce((tags, post) => {
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

	for await (const [tag, tagedPosts] of Object.entries(tagPosts)) {
		const tagPages = await generatePaginatedList(parsedConfig, {
			title: `Posts tagged with ${tag}`,
			basePath: `${parsedConfig.blogPath}/${tag}`,
			slug: `tag-${tag}`
		}, tagedPosts);

		Object.assign(pages, tagPages);
	}

	return pages;
}

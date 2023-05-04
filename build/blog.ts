import { mkdir, readdir, readFile, writeFile } from 'fs/promises';

interface BlogConfig {
	postsDir: string,
	blogPath: string,
	postsTemplate: string,
	postCardTemplate: string,
	homeTemplate: string
}

interface BlogPost {
	title: string,
	slug: string,
	date: string,
	excerpt: string,
	content: string
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

async function getBlogPosts(postsDir = 'blog') {
	const postFiles = await getFiles(postsDir);

	return Promise.all(postFiles.map(async (postPath) => {
		const [fileName, date] = postPath.split('/').reverse();
		const post = await readFile(postPath, { encoding: 'utf8' });
		const [title = fileName, excerpt = '', content = ''] = post.split('\n');

		return {
			title,
			slug: fileName.replace(/.md$/ui, ''),
			date,
			excerpt,
			content
		};
	}));
}

async function generateBlogPostPage({ title, slug, date, content, excerpt }: BlogPost, template: string, blogPath: string) {
	const postDir = `${blogPath}/${date}/${slug}`;
	const filePath = `${postDir}/index.html`;

	const templateContents = await readFile(template, { encoding: 'utf8' });

	const post = templateContents
		.replaceAll('{{ TITLE }}', title)
		.replaceAll('{{ SLUG }}', slug)
		.replaceAll('{{ BLOG_PATH }}', blogPath)
		.replaceAll('{{ POST_PATH }}', postDir)
		.replaceAll('{{ DATE }}', date)
		.replaceAll('{{ EXCERPT }}', excerpt)
		.replaceAll('{{ CONTENT }}', content);

	await mkdir(`src/${postDir}`, { recursive: true });
	await writeFile(`src/${filePath}`, post, { encoding: 'utf8' });

	return [`${date}-${slug}`, `src/${filePath}`];
}

async function getBlogPostsPages(posts: Awaited<ReturnType<typeof getBlogPosts>>, template = 'src/templates/blog/post.html', blogPath = 'blog') {
	return Promise.all(posts.map(async (post) => generateBlogPostPage(post, template, blogPath)));
}

function generateBlogPostCard({ title, slug, date, excerpt }: BlogPost, blogPath: string, template: string) {
	const postDir = `${blogPath}/${date}/${slug}`;

	return template
		.replaceAll('{{ TITLE }}', title)
		.replaceAll('{{ SLUG }}', slug)
		.replaceAll('{{ BLOG_PATH }}', blogPath)
		.replaceAll('{{ POST_PATH }}', postDir)
		.replaceAll('{{ DATE }}', date)
		.replaceAll('{{ EXCERPT }}', excerpt);
}

async function generateBlogHomePage(posts: Awaited<ReturnType<typeof getBlogPosts>>, template = 'src/templates/blog/home.html', postCardTemplate = 'src/templates/blog/post-card.html', blogPath = 'blog') {
	const homeDir = `src/${blogPath}`;
	const filePath = `${homeDir}/index.html`;
	const templateContents = await readFile(template, { encoding: 'utf8' });
	const postCardContents = await readFile(postCardTemplate, { encoding: 'utf8' });

	const content = templateContents
		.replaceAll('{{ BLOG_PATH }}', blogPath)
		.replace('{{ POSTS }}', posts.map((post) => generateBlogPostCard(post, blogPath, postCardContents)).join('\n'));

	await mkdir(homeDir, { recursive: true });
	await writeFile(filePath, content, { encoding: 'utf8' });

	return ['blog-home', filePath];
}

export async function createBlogPages({ postsDir, blogPath, postsTemplate, homeTemplate, postCardTemplate }: Partial<BlogConfig> = {}) {
	const posts = await getBlogPosts(postsDir);
	const pages = [
		await generateBlogHomePage(posts, homeTemplate, postCardTemplate, blogPath),
		...await getBlogPostsPages(posts, postsTemplate, blogPath)
	];

	return Object.fromEntries(pages);
}

import { type SchemaContext, z as zod } from 'astro:content';

export const blogSchema = ({ image }: SchemaContext) => zod.object({
	title: zod.string().describe('The post title that will be displayed as the top of the post page or as the heading on lists.'),
	summary: zod.string().describe('A summary for the post that will show in list pages.'),
	createdAt: zod.string().transform((date: string) => new Date(date)).describe('The post creation date.'),
	updatedAt: zod.string().transform((date: string) => new Date(date)).optional().describe('The post last update date.'),

	image: image().optional().describe('The post main "hero" image path, relative to the blog root.'),
	imageAlt: zod.string().optional().describe('The post main image alt text.'),

	tags: zod.array(zod.string()).optional().describe('The post tags.'),
	updates: zod.array(zod.string()).optional().describe('The post updates.')
});

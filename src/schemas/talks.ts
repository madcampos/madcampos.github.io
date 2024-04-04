import { z as zod, type SchemaContext } from 'astro:content';

export const talksSchema = ({ image }: SchemaContext) => zod.object({
	title: zod.string().describe('The talk title displayed in the talks list.'),
	summary: zod.string().describe('A summary for the talk that will show in the talks list pages.'),
	event: zod.string().describe('The event the talk was given.'),
	eventUrl: zod.string().url().optional().describe('The event URL.'),
	date: zod.date().describe('The talk date.'),
	draft: zod.boolean().optional().describe('Whether the is a draft or not.'),

	image: image().optional().describe('The talk main image path, relative to the site root.'),
	imageAlt: zod.string().optional().describe('The talk main image alt text.'),

	slides: zod.string().url().optional().describe('The talk slides.'),
	video: zod.string().url().optional().describe('The talk video.'),
	code: zod.string().url().optional().describe('The talk code.'),
	demo: zod.string().url().optional().describe('The talk demo.'),
	relatedContent: zod.object({
		title: zod.string().describe('The related content title.'),
		url: zod.string().url().describe('The related content URL.')
	}).array().nonempty().optional().describe('The related content.'),
	techStack: zod.array(zod.string()).optional().describe('The talk technologies used.')
});

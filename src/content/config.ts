import { defineCollection } from 'astro:content';

import { blogSchema } from '../schemas/blog.ts';
import { projectsSchema } from '../schemas/projects.ts';
import { changelogSchema } from '../schemas/changelog.ts';
import { talksSchema } from '../schemas/talks.ts';
import { authorsSchema } from '../schemas/authors.ts';

const blogCollection = defineCollection({
	type: 'content',
	schema: blogSchema
});

const changelogCollection = defineCollection({
	type: 'content',
	schema: changelogSchema
});

const projectsCollection = defineCollection({
	type: 'content',
	schema: projectsSchema
});

const talksCollection = defineCollection({
	type: 'content',
	schema: talksSchema
});

const authorsCollection = defineCollection({
	type: 'content',
	schema: authorsSchema
});

export const collections = {
	blog: blogCollection,
	changelog: changelogCollection,
	projects: projectsCollection,
	talks: talksCollection,
	authors: authorsCollection
};

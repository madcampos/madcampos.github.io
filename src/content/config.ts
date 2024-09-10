import { defineCollection } from 'astro:content';

import { authorsSchema } from '../schemas/authors.js';
import { blogSchema } from '../schemas/blog.js';
import { changelogSchema } from '../schemas/changelog.js';
import { projectsSchema } from '../schemas/projects.js';
import { talksSchema } from '../schemas/talks.js';

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

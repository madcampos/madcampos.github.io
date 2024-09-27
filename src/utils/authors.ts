import { type CollectionEntry, getCollection, getEntry } from 'astro:content';

export async function listAllAuthors() {
	const authorEntries = await getCollection('authors');
	const authors = authorEntries.sort((first, second) => first.data.name.localeCompare(second.data.name, 'en-US', { usage: 'sort' }));

	return authors as unknown as CollectionEntry<'authors'>[];
}

export async function getAuthor(authorId: string) {
	return getEntry('authors', authorId) as unknown as Promise<CollectionEntry<'authors'> | undefined>;
}

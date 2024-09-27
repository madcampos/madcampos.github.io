import { type CollectionEntry, getCollection } from 'astro:content';

export async function listAllProjects() {
	const projectEntries = await getCollection('projects');

	const projects = projectEntries.filter((talk) => !talk.data.draft).sort((first, second) => first.data.title.localeCompare(second.data.title));

	return projects as unknown as CollectionEntry<'projects'>[];
}

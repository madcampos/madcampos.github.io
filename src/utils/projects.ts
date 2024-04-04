import { getCollection } from 'astro:content';

export async function listAllProjects() {
	const projectEntries = await getCollection('projects');

	const projects = projectEntries.filter((talk) => !talk.data.draft).sort((first, second) => first.id.localeCompare(second.id));

	return projects;
}

import { getCollection } from 'astro:content';

export async function listAllProjects() {
	const projectEntries = await getCollection('projects');

	const projects = projectEntries.sort((first, second) => first.id.localeCompare(second.id));

	return projects;
}

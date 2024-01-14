import { getCollection } from 'astro:content';

export async function listAllTalks() {
	const talkEntries = await getCollection('talks');

	const talks = talkEntries.sort((first, second) => first.data.date.getTime() - second.data.date.getTime());

	return talks;
}

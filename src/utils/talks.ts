import { getCollection } from 'astro:content';

export async function listAllTalks() {
	const talkEntries = await getCollection('talks');

	const talks = talkEntries.filter((talk) => !talk.data.draft).sort((first, second) => first.data.date.getTime() - second.data.date.getTime());

	return talks;
}

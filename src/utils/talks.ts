import { type CollectionEntry, getCollection } from 'astro:content';

export async function listAllTalks() {
	const talkEntries = await getCollection('talks');

	const talks = talkEntries.filter((talk) => !talk.data.draft).sort((first, second) =>
		(second.data.date?.getTime() ?? 0) - (first.data.date?.getTime() ?? 0) || first.data.title.localeCompare(second.data.title, 'en-US')
	);

	return talks as unknown as CollectionEntry<'talks'>[];
}

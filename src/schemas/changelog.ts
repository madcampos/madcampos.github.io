import { z as zod } from 'astro:content';

export const changelogSchema = () => zod.object({
	versionName: zod.string().optional().describe('The version name.'),
	date: zod.string().transform((date: string) => new Date(date)).describe('The version release date.')
});

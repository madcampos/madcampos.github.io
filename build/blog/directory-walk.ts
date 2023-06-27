import { readdir, rm } from 'fs/promises';

export async function getFiles(dir: string) {
	const entries = await readdir(dir, { withFileTypes: true });

	const files: string[] = [];

	for await (const entry of entries) {
		if (entry.name.startsWith('.')) {
			continue;
		}

		if (!entry.isDirectory() && !entry.name.endsWith('.md')) {
			continue;
		}

		const path = `${dir}/${entry.name}`;

		if (entry.isDirectory()) {
			files.push(...await getFiles(path));
		} else {
			files.push(path);
		}
	}

	return files;
}

export async function removeDirectory(dirPath: string) {
	try {
		await rm(dirPath, { recursive: true });
	} catch {
		// Silently ignore errors
	}
}

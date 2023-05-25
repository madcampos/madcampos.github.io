import { copyFile as cp, mkdir, writeFile } from 'fs/promises';
import { basename, dirname } from 'path';

export async function createFile(filePath: string, contents: string) {
	const destPath = dirname(filePath);

	await mkdir(destPath, { recursive: true });
	await writeFile(filePath, contents, { encoding: 'utf8' });
}

export async function createHtmlFile(destPath: string, contents: string) {
	const filePath = `${destPath}/index.html`;

	await createFile(filePath, contents);

	return filePath;
}

export async function copyFile(filePath: string, destPath: string) {
	const fileName = basename(filePath);
	const normalizedPath = decodeURI(fileName);

	await mkdir(destPath, { recursive: true });
	await cp(filePath, `${destPath}/${normalizedPath}`);
}

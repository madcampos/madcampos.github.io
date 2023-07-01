import { copyFile as cp, mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

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
	const normalizedFilePath = filePath.replaceAll(/\/\//giu, '/');
	const normalizedDestPath = destPath.replaceAll(/\/\//giu, '/');
	const destDir = dirname(normalizedDestPath);

	await mkdir(destDir, { recursive: true });
	await cp(normalizedFilePath, normalizedDestPath);
}

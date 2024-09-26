interface JoinOptions {
	trailingSlash: boolean | undefined;
	separator: '/' | '\\';
}

export function join(paths: string[], options?: Partial<JoinOptions>) {
	const opts: JoinOptions = {
		trailingSlash: true,
		separator: '/',
		...options
	};

	const joinedPath = paths.join(opts.separator).replaceAll(new RegExp(`(?<!:)${opts.separator}{2,}`, 'giu'), opts.separator);

	let normalizedPath = joinedPath;

	switch (opts.trailingSlash) {
		case true:
			normalizedPath = `${joinedPath}${opts.separator}`.replaceAll(new RegExp(`(?<!:)${opts.separator}{2,}`, 'giu'), opts.separator);
			break;
		case false:
			normalizedPath = joinedPath.replace(new RegExp(`${opts.separator}$`, 'iu'), '');
			break;
		default:
	}

	return normalizedPath;
}

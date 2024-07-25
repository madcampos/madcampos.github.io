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

	const joinedPath = paths.join(opts.separator).replaceAll(`${opts.separator}${opts.separator}`, opts.separator);

	let normalizedPath = joinedPath;

	switch (opts.trailingSlash) {
		case true:
			normalizedPath = `${joinedPath}${opts.separator}`.replaceAll(`${opts.separator}${opts.separator}`, opts.separator);
			break;
		case false:
			normalizedPath = joinedPath.replace(new RegExp(`${opts.separator}$`, 'u'), '');
			break;
		default:
	}

	return normalizedPath;
}

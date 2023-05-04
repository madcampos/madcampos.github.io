/// <reference types="urlpattern-polyfill" />
/// <reference types="vite/client" />

type Serializable = string | number | boolean | Serializable[] | { [key: string]: Serializable };

interface PackageJsonVariables {
	homepage: string,
	displayName: string,
	shortName: string,
	description: string,
	keywords: string[],
	author: {
		name: string,
		email: string
	},
	version: string,
	[key: string]: Serializable
}

interface ImportMetaEnv {
	/** The app mode. Can be either `development` or `production`. */
	readonly MODE: 'development' | 'production',
	readonly PROD: boolean,
	readonly DEV: boolean,

	/** The project's base url. */
	readonly BASE_URL: string
}

interface ImportMeta {
	hot: {
		accept: Function,
		dispose: Function
	},
	readonly env: ImportMetaEnv
}

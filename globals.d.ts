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
	readonly BASE_URL: string,
	/** The project's public url. */
	readonly APP_PUBLIC_URL: string,

	/** The app's full name. */
	readonly APP_NAME: string,
	/** The app's short name, used for PWAs. */
	readonly APP_SHORT_NAME: string,
	/** The app's description. */
	readonly APP_DESCRIPTION: string,
	/** The app's keywords. */
	readonly APP_KEYWORDS: string,
	/** The app's author. */
	readonly APP_AUTHOR: string,
	/** The app's version */
	readonly APP_VERSION: string,

	/** The app's theme color. */
	readonly APP_THEME_COLOR: string,
	/** The app's background color */
	readonly APP_BACKGROUND_COLOR: string,

	/** The icon used for Apple devices. */
	readonly APP_APPLE_ICON: string,
	/** The _small_ icon used for all other devices. */
	readonly APP_SMALL_ICON: string,
	/** The _small_ icon used for all other devices, with maskable background. */
	readonly APP_SMALL_ICON_BG: string,
	/** The _large_ icon used for all other devices. */
	readonly APP_LARGE_ICON: string,
	/** The _large_ icon used for all other devices, with maskable background. */
	readonly APP_LARGE_ICON_BG: string,

	/** The app's main social image */
	readonly APP_SOCIAL_IMAGE: string,

	/** The app's database version. */
	readonly APP_DB_VERSION: string
}

interface ImportMeta {
	hot: {
		accept: Function,
		dispose: Function
	},
	readonly env: ImportMetaEnv
}

declare module "ember-intl" {
	export function formatMessage(message: string, options: {}): string;
	export function formatRelative(date: Date, options: {}): string;
	export function formatNumber(number: number, options: {}): string;
	export function formatTime(date: Date, options: {}): string;
	export function formatDate(date: Date, options: {}): string;

	export function lookup(key: string, localeName?: string, options?: object): string;
	export function t(key: string, options?: object): string;
	export function exists(key: string, localeName?: string): boolean;

	export function setLocale(locale: string): void;

	export function addLocaleData(data: object): void;
	export function addTranslations(localeName: string, payload: object): unknown;

	export function translationsFor(localeName: string): unknown;

	export function getFormat(formatType: string, format: string): unknown;

	export function localeWithDefault(localeName?: string): string[];
}

declare module '@ember-intl/decorators' {
	export function t(key: string, options?: object): any;
}
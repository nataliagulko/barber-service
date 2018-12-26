declare module "toastr" {
	export function success(msg: string, title: string, options?: object): void
	export function info(msg: string, title: string, options?: object): void
	export function warning(msg: string, title: string, options?: object): void
	export function error(msg: string, title: string, options?: object): void
	export function clear(): void
	export function remove(): void
}
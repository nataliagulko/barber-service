import Service from '@ember/service';

export default class ToastrService extends Service {
	success(msg: string, title: string, options?: object): void
	info(msg: string, title: string, options?: object): void
	warning(msg: string, title: string, options?: object): void
	error(msg: string, title: string, options?: object): void
	clear(): void
	remove(): void
}

declare module '@ember/service' {
	interface Registry {
		'toastr': ToastrService;
	}
}

import Service from "@ember/service";

export default class PickatimeService extends Service {
	init(): void
	setFunc(selector: string, func: string, params: any): void
	on(selector: string, method: string, callback: void): void
	stop(selector: string): void
	render(selector: string): void
}

declare module '@ember/service' {
	interface Registry {
		"pickatime-service": PickatimeService;
	}
}
import Service from "@ember/service";

export default class PickadateService extends Service {
	init(): void
	setFunc(selector: string, func: string, params: any): void
	on(selector: string, method: string, callback: void): void
}

declare module '@ember/service' {
	interface Registry {
		"pickadate-service": PickadateService;
	}
}
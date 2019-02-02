import Service from "@ember/service";

export default class BootboxService extends Service {
	confirmDelete(store: any, type: string, id: number) {
		store.findRecord(type, id, { backgroundReload: false }).then((item: any) => {
			item.destroyRecord();
		});
	}
}

declare module "@ember/service" {
	interface Registry {
		"bootbox-service": BootboxService;
	}
}

import { get } from "@ember/object";
import Service, { inject as service } from "@ember/service";

export default class NotificationService extends Service {
	toast = service("toast");

	info(this: NotificationService, message: string) {
		get(this, "toast").info(message);
	}

	error(this: NotificationService, message: string) {
		get(this, "toast").error(message);
	}

	success(this: NotificationService, message: string) {
		get(this, "toast").success(message);
	}

	warning(this: NotificationService, message: string) {
		get(this, "toast").warning(message);
	}
}

declare module "@ember/service" {
	interface Registry {
		"notification-service": NotificationService;
	}
}

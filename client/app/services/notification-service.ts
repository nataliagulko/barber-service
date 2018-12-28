import { get } from "@ember/object";
import Service, { inject as service } from "@ember/service";

export default class NotificationService extends Service {
	flash = service("flash");

	info(this: NotificationService, message: string) {
		alert(message);
		// get(this, "flash").info(message);
	}

	error(this: NotificationService, message: string) {
		alert(message);
		// get(this, "flash").danger(message);
	}

	success(this: NotificationService, message: string) {
		alert(message);
		// get(this, "flash").success(message);
	}

	warning(this: NotificationService, message: string) {
		alert(message);
		// get(this, "flash").warning(message);
	}
}

declare module "@ember/service" {
	interface Registry {
		"notification-service": NotificationService;
	}
}

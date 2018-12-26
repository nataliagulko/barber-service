import { service } from "@ember-decorators/service";
import Service from "@ember/service";
import FlashMessageService from "ember-cli-flash/services/flash-messages";

export default class NotificationService extends Service {
	@service
	public flash!: FlashMessageService;

	public showInfoMessage(message: string) {
		this.get("flash").info(message);
	}

	public showErrorMessage(message: string) {
		this.get("flash").danger(message);
	}

	public showSuccessMessage(message: string) {
		this.get("flash").success(message);
	}

	public showWarningMessage(message: string) {
		this.get("flash").warning(message);
	}
}

declare module "@ember/service" {
	interface Registry {
		"notification-service": NotificationService;
	}
}

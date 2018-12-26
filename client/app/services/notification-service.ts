import Service from '@ember/service';
import { info, error, success, warning, remove } from 'toastr';

export default class NotificationService extends Service {
	public showInfoMessage(message: string, title = '', options = {}) {
		info(message, title, options);
	}

	public showErrorMessage(message: string, title = '', options = {}) {
		error(message, title, options);
	}

	public showSuccessMessage(message: string, title = '', options = {}) {
		success(message, title, options);
	}

	public showWarningMessage(message: string, title = '', options = {}) {
		warning(message, title, options);
	}

	public removeAllToasts() {
		remove();
	}
}

declare module '@ember/service' {
	interface Registry {
		'notification-service': NotificationService;
	}
}

import Service from '@ember/service';
import { service } from '@ember-decorators/service';
import ToastrService from 'nova/toastr/services/toastr';

export default class NotificationService extends Service {
	@service
	toast: ToastrService

	public showInfoMessage(message: string, title = '', options = {}) {
		this.toast.info(message, title, options);
	}

	public showErrorMessage(message: string, title = '', options = {}) {
		this.toast.error(message, title, options);
	}

	public showSuccessMessage(message: string, title = '', options = {}) {
		this.toast.success(message, title, options);
	}

	public showWarningMessage(message: string, title = '', options = {}) {
		this.toast.warning(message, title, options);
	}

	public removeAllToasts() {
		this.toast.remove();
	}
}

declare module '@ember/service' {
	interface Registry {
		'notification-service': NotificationService;
	}
}

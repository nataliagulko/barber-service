import $ from 'jquery';
import Component from '@ember/component';
import { inject } from '@ember/service';
import config from 'barbers/config/environment';

export default Component.extend({
	tagName: 'form',
	classNames: ['forget-form'],
	notification: inject("notification-service"),
	phoneMask: ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
	isCodeSent: false,

	actions: {
		showLogin: function () {
			this.set("isLoginShown", true);
		},

		sumbitCode: function () {
			const params = $(".forget-form").serialize();
			const notification = this.get('notification');

			this.set('isCodeSent', true);

			$.post({
				url: config.host + '/register/createChangePassRequest',
				data: params
			}).then((response) => {

				if (!response.error) {
					this.set("code", response.id);
					notification.showInfoMessage(response.code);
				} else {
					notification.showErrorMessage(response.error);
				}
			});
		},

		checkCode: function () {
			const params = $(".forget-form").serialize();
			const notification = this.get('notification');

			$.post({
				url: config.host + '/register/submitChangePassRequest',
				data: params
			}).then((response) => {
				if (!response.error) {
					this.set('isLoginShown', true);
					notification.showInfoMessage(`Доступ восстановлен`);
				} else {
					notification.showErrorMessage(response.error);
				}
			});
		}
	}
});

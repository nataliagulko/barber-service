import $ from 'jquery';
import Component from '@ember/component';
import { inject } from '@ember/service';
import { alias } from '@ember/object/computed';
import config from 'barbers/config/environment';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	'phone': validator('presence', true),
	'pass': validator('presence', true),
	'rpass': validator('presence', true)
});

export default Component.extend(Validations, {
	tagName: 'form',
	classNames: ['forget-form'],
	notification: inject("notification-service"),
	phoneMask: ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
	isFormInvalid: alias('validations.isInvalid'),
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
					this.set("requestId", response.id);
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

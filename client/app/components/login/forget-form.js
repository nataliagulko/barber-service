import $ from 'jquery';
import Component from '@ember/component';
import { inject } from '@ember/service';
import { alias, readOnly } from '@ember/object/computed';
import config from 'nova/config/environment';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	'phone': [
		validator('presence', true),
		validator('format', {
			type: 'phone',
			allowBlank: false,
			regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/
		})
	],
	'pass': [
		validator('presence', true),
		validator('length', {
			min: 6,
			max: 20
		}),
		validator('format', {
			regex: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})/,
			messageKey: 'auth.registration.password.validation.message'
		})
	],
	'rpass': [
		validator('presence', true),
		validator('confirmation', {
			on: 'pass',
		})
	]
});

export default Component.extend(Validations, {
	notification: inject("notification-service"),
	constants: inject("constants-service"),
	phoneMask: readOnly("constants.PHONE_MASK"),
	isFormInvalid: alias('validations.isInvalid'),

	submit() {
		const isCodeSent = this.get("isCodeSent");

		if (isCodeSent) {
			this.send("checkCode");
		} else {
			this.send("sumbitCode");
		}
	},

	actions: {
		showLogin: function () {
			this.set("isLoginShown", true);
		},

		sumbitCode: function () {
			const notification = this.get('notification');
			const params = {
				phone: this.get("phone"),
				pass: this.get("pass")
			};

			$.post({
				url: config.host + '/register/createChangePassRequest',
				data: params
			}).then((response) => {
				if (!response.error) {
					this.set('isCodeSent', true);
					this.set("requestId", response.id);
					// показывать только в дев режиме
					notification.showInfoMessage(response.code);
				} else {
					notification.showErrorMessage(response.error);
				}
			});
		},

		checkCode: function () {
			const notification = this.get('notification');
			const i18n = this.get('i18n');
			const params = {
				phone: this.get("phone"),
				requestId: this.get("requestId"),
				code: this.get("code")
			};

			$.post({
				url: config.host + '/register/submitChangePassRequest',
				data: params
			}).then((response) => {
				if (!response.error) {
					this.set('isLoginShown', true);
					notification.showInfoMessage(i18n.t("auth.login.access.restore"));
				} else {
					notification.showErrorMessage(response.error);
				}
			});
		}
	}
});

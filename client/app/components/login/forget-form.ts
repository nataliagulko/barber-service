import { reads } from "@ember-decorators/object/computed";
import { t } from "@ember-intl/decorators";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import { buildValidations, validator } from "ember-cp-validations";
import $ from "jquery";
import config from "nova/config/environment";

const Validations = buildValidations({
	pass: [
		validator("presence", true),
		validator("length", {
			max: 20,
			min: 6,
		}),
		validator("format", {
			messageKey: "auth.registration.password.validation.message",
			regex: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})/,
		}),
	],
	phone: [
		validator("presence", true),
		validator("format", {
			allowBlank: false,
			regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/,
			type: "phone",
		}),
	],
	rpass: [
		validator("presence", true),
		validator("confirmation", {
			on: "pass",
		}),
	],
});

export default class ForgetForm extends Component.extend(Validations) {
	isCodeSent!: boolean
	isLoginShown!: boolean
	requestId!: string
	code!: string
	phone!: string
	pass!: string

	session = service("session");
	notification = service("notification-service");

	@reads("constants.PHONE_MASK")
	phoneMask!: Array<RegExp | string>;

	@reads("validations.isInvalid")
	isFormInvalid!: boolean;

	@t("auth.login.access.restore")
	message!: string;

	submit(this: ForgetForm) {
		const isCodeSent = this.isCodeSent;

		if (isCodeSent) {
			this.send("checkCode");
		} else {
			this.send("sumbitCode");
		}
	}

	actions = {
		showLogin(this: ForgetForm) {
			this.set("isLoginShown", true);
		},

		sumbitCode(this: ForgetForm) {
			const forgetForm = this;
			const params = {
				pass: this.pass,
				phone: this.phone,
			};

			$.post({
				data: params,
				url: config.host + "/register/createChangePassRequest",
			}).then((response) => {
				if (!response.error) {
					this.set("isCodeSent", true);
					this.set("requestId", response.id);
					// показывать только в дев режиме
					get(forgetForm, "notification").info(response.code);
				} else {
					get(forgetForm, "notification").error(response.error);
				}
			});
		},

		checkCode(this: ForgetForm) {
			const forgetForm = this;
			const params = {
				code: this.code,
				phone: this.phone,
				requestId: this.requestId,
			};

			$.post({
				data: params,
				url: config.host + "/register/submitChangePassRequest",
			}).then((response) => {
				if (!response.error) {
					this.set("isLoginShown", true);
					get(forgetForm, "notification").info(forgetForm.message);
				} else {
					get(forgetForm, "notification").error(response.error);
				}
			});
		},
	},
};

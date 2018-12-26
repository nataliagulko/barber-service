import { action } from "@ember-decorators/object";
import { reads } from "@ember-decorators/object/computed";
import { service } from "@ember-decorators/service";
import Component from "@ember/component";
import { t } from "ember-intl";
import ConstantsService from "nova/services/constants-service";
import NotificationService from "nova/services/notification-service";

export default class LoginForm extends Component {
	public username: string = "";
	public password: string = "";
	public isLoginShown: boolean = true;

	@service
	public constants!: ConstantsService;

	@service
	public notification!: NotificationService;

	@service
	public session!: any;

	@reads("constants.PHONE_MASK") public phoneMask: Array<RegExp | string> = [];

	@action
	public authenticate(this: LoginForm) {
		const credentials = this.getProperties("username", "password");
		const authenticator = "authenticator:token";

		this.session.authenticate(authenticator, credentials)
			.then(() => { },
				() => {
					const message = t("auth.login.bad.credentials");
					// console.log(message);
					this.get("notification").showErrorMessage(message);
				});
	}

	@action
	public showForgetPassword(this: LoginForm) {
		this.set("isLoginShown", false);
	}

}

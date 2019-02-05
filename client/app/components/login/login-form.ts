import { reads } from "@ember-decorators/object/computed";
import { t } from "@ember-intl/decorators";
import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";

export default class LoginForm extends Component {
	username!: string;
	password!: string;
	isLoginShown: boolean = true;

	sessionService = service("session");
	notification = service("notification-service");
	constants = service("constants-service");

	@reads("constants.PHONE_MASK")
	phoneMask!: Array<RegExp | string>;

	@t("auth.login.bad.credentials")
	message!: string;

	actions = {
		authenticate(this: LoginForm) {
			const loginForm = this;
			const credentials = loginForm.getProperties("username", "password");

			get(loginForm, "sessionService").authenticate("authenticator:token", credentials)
				.then(() => { },
					() => {
						get(loginForm, "notification").error(loginForm.message);
					});
		},

		showForgetPassword(this: LoginForm) {
			set(this, "isLoginShown", false);
		},
	};
}

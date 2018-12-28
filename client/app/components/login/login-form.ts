import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { set } from "@ember/object";
import { inject as service } from "@ember/service";

export default class LoginForm extends Component {
	public username!: string;
	public password!: string;
	public isLoginShown: boolean = true;

	public session = service();
	public notification = service("notification-service");
	public constants = service("constants-service");
	public intl = service();

	@reads("constants.PHONE_MASK")
	public phoneMask!: Array<RegExp | string>;

	public actions = {
		authenticate(this: LoginForm) {
			const loginForm = this;
			const credentials = loginForm.getProperties("username", "password");
			const authenticator = "authenticator:token";

			loginForm.session.authenticate(authenticator, credentials)
				.then(() => { },
					() => {
						const message = loginForm.get("intl").t("auth.login.bad.credentials");
						loginForm.get("notification").showErrorMessage(message);
					});
		},

		showForgetPassword(this: LoginForm) {
			set(this, "isLoginShown", false);
		},
	};
}

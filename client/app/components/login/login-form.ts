import Component from '@ember/component';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import NotificationService from 'nova/services/notification-service';
import ConstantsService from 'nova/services/constants-service';
import { action } from '@ember-decorators/object';
import IntlService from 'types/nova/intl/services/intl';

export default class LoginForm extends Component {
	username: string = ''
	password: string = ''

	// session: inject(),
	// intl: inject()
	@service
	intl!: IntlService;

	@service
	notification!: NotificationService;

	@service
	constants!: ConstantsService;

	@reads('constants.PHONE_MASK') phoneMask: (RegExp | string)[] = []

	@action
	authenticate() {
		const _this = this;
		const credentials = this.getProperties('username', 'password');
		const authenticator = 'authenticator:token';

		this.session.authenticate(authenticator, credentials)
			.then(() => { },
				() => {
					const message = _this.get("intl").t("auth.login.bad.credentials");
					_this.get("notification").showErrorMessage(message);
				});
	}

	@action
	showForgetPassword() {
		this.set("isLoginShown", false);
	}

}

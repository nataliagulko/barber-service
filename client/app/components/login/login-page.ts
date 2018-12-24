import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class LoginPage extends Component {
	classNames: string[] = ["login"]
	isLoginShown: boolean = true

	@action
	showLogin(this: LoginPage) {
		this.set("isLoginShown", true);
	}
}

import { action } from "@ember-decorators/object";
import Component from "@ember/component";

export default class LoginPage extends Component {
	public classNames: string[] = ["login"];
	public isLoginShown: boolean = true;

	@action
	public showLogin(this: LoginPage) {
		this.set("isLoginShown", true);
	}
}

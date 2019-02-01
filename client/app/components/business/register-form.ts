import { reads } from "@ember-decorators/object/computed";
import { t } from "@ember-intl/decorators";
import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";

export default class RegisterForm extends Component {
	master: any;
	business: any;

	notification = service("notification-service");
	constants = service("constants-service");
	router = service("router");

	@reads("constants.PHONE_MASK")
	phoneMask!: Array<RegExp | string>;

	@t("business.registration.success"/*, {name, master}*/)
	message!: string;

	submit() {
		this.send("saveBusiness");
	}

	actions = {
		saveMaster(this: RegisterForm, business: any) {
			const registerForm = this;
			const masterRecord = this.master;

			masterRecord.set("business", business);
			masterRecord.set("enabled", true);
			masterRecord.save()
				.then((master: any) => {
					get(registerForm, "notification").error(registerForm.message);
					get(registerForm, "router").transitionTo("login");
				});
		},

		saveBusiness(this: RegisterForm) {
			const registerForm = this;
			const businessRecord = this.business;
			const masterRecord = this.master;

			// validate business
			// businessRecord
			// 	.validate()
			// 	.then(({ validations }) => {
			// 		if (validations.get("isValid")) {
			// 			// then validate master
			// 			masterRecord.validate()
			// 				.then(({ validations }) => {
			// 					if (validations.get("isValid")) {
			// 						// and after save business
			// 						businessRecord.save()
			// 							.then((business) => {
			// 								registerForm.send("saveMaster", business);
			// 							});
			// 					}
			// 				});
			// 		}
			// 	});
		},
	}
}

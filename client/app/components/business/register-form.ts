import { reads } from "@ember-decorators/object/computed";
import { t } from "@ember-intl/decorators";
import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { Validations } from "ember-cp-validations";
import Business from "nova/models/business";
import Master from "nova/models/master";

export default class RegisterForm extends Component {
	master!: Master;
	business!: Business;

	notification = service("notification-service");
	constants = service("constants-service");
	router = service("router");

	@reads("constants.PHONE_MASK")
	phoneMask!: Array<RegExp | string>;

	@t("business.registration.success", { name: "business.name", master: "master.firstname" })
	message!: string;

	submit() {
		this.send("saveBusiness");
	}

	actions = {
		saveMaster(this: RegisterForm, business: Business) {
			const registerForm = this;
			const masterRecord = this.master;

			set(masterRecord, "business", business);
			set(masterRecord, "enabled", true);
			masterRecord.save()
				.then(() => {
					get(registerForm, "notification").error(registerForm.message);
					get(registerForm, "router").transitionTo("login");
				});
		},

		saveBusiness(this: RegisterForm) {
			const registerForm = this;
			const businessRecord = this.business;
			const masterRecord = this.master;

			// validate business
			businessRecord
				.validate()
				.then(({ validations: bValidations }: Validations) => {
					if (get(bValidations, "isValid")) {
						// then validate master
						masterRecord.validate()
							.then(({ validations: mValidations }: Validations) => {
								if (get(mValidations, "isValid")) {
									// and after save business
									businessRecord.save()
										.then((business) => {
											registerForm.send("saveMaster", business);
										});
								}
							});
					}
				});
		},
	}
}

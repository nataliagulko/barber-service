import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { Validations } from "ember-cp-validations";
import Master from "nova/models/master";

export default class MasterForm extends Component {
	master!: Master

	constants = service("constants-service")
	currentUser = service("current-user-service")
	router = service("router")

	@reads("constants.PHONE_MASK")
	phoneMask!: Array<RegExp | string>

	actions = {
		save(this: MasterForm) {
			const masterForm = this;
			const masterRecord = get(masterForm, "master")
			const user = get(masterForm, "currentUser")
			const business = get(user, "business");

			set(masterRecord, "enabled", false);
			set(masterRecord, "business", business);
			masterRecord
				.validate()
				.then(({ validations }: Validations) => {
					if (get(validations, "isValid")) {
						masterRecord
							.save()
							.then(() => {
								get(masterForm, "router").transitionTo("auth.master");
							});
					}
				});

		},
	},
}

import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import { Validations } from "ember-cp-validations";
import Service from "nova/models/service";

export default class ServiceForm extends Component {
	service!: Service

	store = service("store")
	router = service("router")

	actions = {
		save(this: ServiceForm) {
			const serviceForm = this;
			const router = get(serviceForm, "router")
			const serviceRecord = get(this, "service");

			serviceRecord
				.validate()
				.then(({ validations }: Validations) => {
					if (get(validations, "isValid")) {
						serviceRecord
							.save()
							.then(() => {
								router.transitionTo("auth.service");
							});
					}
				});

		},
	}
}

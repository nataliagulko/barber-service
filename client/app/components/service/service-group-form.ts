import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import { Validations } from "ember-cp-validations";
import ServiceGroup from "nova/models/service-group";
import ServiceToGroup from "nova/models/service-to-group";

export default class ServiceGroupForm extends Component {
	serviceGroup!: ServiceGroup

	store = service("store")
	router = service("router")
	serviceToGroupService = service("service-to-group-service")

	@reads("serviceToGroupService.servicesToGroup")
	servicesToGroup!: ServiceToGroup[]

	actions = {
		save(this: ServiceGroupForm) {
			const serviceGroupForm = this;
			const router = get(serviceGroupForm, "router")
			const serviceGroupRecord = get(serviceGroupForm, "serviceGroup")
			const servicesToGroup = get(serviceGroupForm, "servicesToGroup")

			serviceGroupRecord
				.validate()
				.then(({ validations }: Validations) => {
					if (get(validations, "isValid")) {
						serviceGroupRecord
							.save()
							.then((record) => {
								servicesToGroup.forEach((item, ind) => {
									item.set("serviceGroup", record);
									item.set("serviceOrder", ind);
									item.save();
								});
								router.transitionTo("auth.service");
							});
					}
				});
		},
	}
}

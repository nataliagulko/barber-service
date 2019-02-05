import { get } from "@ember/object";
import Route from "@ember/routing/route";
import RollbackAttributesMixin from "nova/mixins/rollback-attributes-mixin";
import { hash } from "rsvp";

export default class CreateRoute extends Route.extend(RollbackAttributesMixin) {
	model(this: CreateRoute) {
		const store = get(this, "store")

		return hash({
			service: store.createRecord("service"),
			serviceGroup: store.createRecord("serviceGroup"),
			masters: store.findAll("master"),
			subservices: store.query("service", {
				onlySimpleService: true,
			}),
		});
	}

	deactivate(this: CreateRoute) {
		this._super(...arguments);

		const model: any = this.modelFor(this.routeName);
		this.rollback(model.service);
		this.rollback(model.serviceGroup);
	}
}

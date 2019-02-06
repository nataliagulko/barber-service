import { get } from "@ember/object";
import Route from "@ember/routing/route";
import RollbackAttributesMixin from "nova/mixins/rollback-attributes-mixin";
import { hash } from "rsvp";

export default class AuthServiceGroupEditRoute extends Route.extend(RollbackAttributesMixin) {
	model(this: AuthServiceGroupEditRoute, params: any) {
		const store = get(this, "store")
		return hash({
			serviceGroup: store.findRecord("service-group", params.id),
			masters: store.findAll("master"),
			subservices: store.findAll("service"),
		});
	}

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.serviceGroup);
	}
}

import { get } from "@ember/object";
import Route from "@ember/routing/route";
import RollbackAttributesMixin from "nova/mixins/rollback-attributes-mixin";
import { hash } from "rsvp";

export default class AuthServiceEditRoute extends Route.extend(RollbackAttributesMixin) {
	model(this: AuthServiceEditRoute, params: any) {
		const store = get(this, "store")
		return hash({
			service: store.findRecord("service", params.id),
			masters: store.findAll("master"),
		});
	}

	deactivate(this: AuthServiceEditRoute) {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.service);
	}
}

import { get } from "@ember/object";
import Route from "@ember/routing/route";
import RollbackAttributesMixin from "nova/mixins/rollback-attributes-mixin";
import { hash } from "rsvp";

export default class EditRoute extends Route.extend(RollbackAttributesMixin) {
	model(this: EditRoute, params: any) {
		const store = get(this, "store")
		return hash({
			service: store.findRecord("service", params.id),
			masters: store.findAll("master"),
		});
	}

	deactivate(this: EditRoute) {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.service);
	}
}

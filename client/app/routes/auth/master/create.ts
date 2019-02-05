import { get } from "@ember/object";
import Route from "@ember/routing/route";
import RollbackAttributesMixin from "nova/mixins/rollback-attributes-mixin";

export default class CreateRoute extends Route.extend(RollbackAttributesMixin) {
	model(this: CreateRoute) {
		return get(this, "store").createRecord("master");
	}

	deactivate(this: CreateRoute) {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model);
	}
}

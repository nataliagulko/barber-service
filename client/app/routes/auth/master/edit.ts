import { get } from "@ember/object";
import Route from "@ember/routing/route";
import RollbackAttributesMixin from "nova/mixins/rollback-attributes-mixin";

export default class EditRoute extends Route.extend(RollbackAttributesMixin) {
	model(this: EditRoute, params: any) {
		return get(this, "store").findRecord("master", params.master_id);
	}

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model);
	}
}

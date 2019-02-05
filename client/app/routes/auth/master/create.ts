import { get } from "@ember/object";
import Route from "@ember/routing/route";
import RollbackAttributesMixin from "nova/mixins/rollback-attributes-mixin";

export default class AuthMasterCreateRoute extends Route.extend(RollbackAttributesMixin) {
	model(this: AuthMasterCreateRoute) {
		return get(this, "store").createRecord("master");
	}

	deactivate(this: AuthMasterCreateRoute) {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model);
	}
}

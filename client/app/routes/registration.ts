import { get } from "@ember/object";
import Route from "@ember/routing/route";
import UnauthenticatedRouteMixin from "ember-simple-auth/mixins/unauthenticated-route-mixin";
import { hash } from "rsvp";

export default class RegistrationRoute extends Route.extend(UnauthenticatedRouteMixin) {
	model(this: RegistrationRoute) {
		const store = get(this, "store")

		return hash({
			business: store.createRecord("business"),
			master: store.createRecord("master"),
		});
	}
}

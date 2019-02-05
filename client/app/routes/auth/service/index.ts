import { get } from "@ember/object";
import Route from "@ember/routing/route";

export default class AuthServiceIndexRoute extends Route {
	model(this: AuthServiceIndexRoute) {
		return get(this, "store").findAll("service");
	}
}

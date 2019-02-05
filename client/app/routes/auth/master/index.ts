import { get } from "@ember/object";
import Route from "@ember/routing/route";

export default class AuthMasterIndexRoute extends Route {
	model(this: AuthMasterIndexRoute) {
		return get(this, "store").findAll("master");
	}
}

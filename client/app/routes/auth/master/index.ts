import { get } from "@ember/object";
import Route from "@ember/routing/route";

export default class IndexRoute extends Route {
	model(this: IndexRoute) {
		return get(this, "store").findAll("master");
	}
}

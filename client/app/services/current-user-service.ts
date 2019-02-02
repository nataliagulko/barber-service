import { get, set } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { isEmpty } from "@ember/utils";
import RSVP from "rsvp";

export default class CurrentUserService extends Service {
	master!: any;
	business!: any;

	session = service("session");
	store = service("store");

	load(this: CurrentUserService) {
		const s = this
		const phone = get(s, "session.data.authenticated.username");

		if (!isEmpty(phone)) {
			return this.store.queryRecord("master", { phone }).then((master: any) => {
				set(s, "master", master);
				set(s, "business", master.get("business"));
			});
		} else {
			return RSVP.resolve();
		}
	}
}

declare module "@ember/service" {
	interface Registry {
		"current-user-service": CurrentUserService;
	}
}

import { get } from "@ember/object";
import Route from "@ember/routing/route";
import { hash } from "rsvp";

export default class WorkTimeRoute extends Route {
	model(this: WorkTimeRoute, params: any) {
		const store = get(this, "store")

		return hash({
			workTimes: store.query("workTime", {
				masterId: params.master_id,
			}),
			holidays: store.query("holiday", {
				masterId: params.master_id,
			}),
			master: store.findRecord("master", params.master_id),
		});
	}
}

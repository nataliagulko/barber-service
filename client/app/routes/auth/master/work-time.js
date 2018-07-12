import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	queryParams: {
		refreshModel: true
	},

	model(params) {
		return hash({
			workTimes: this.get("store").query("workTime", {
				masterId: params.master_id
			}),
			holidays: this.get("store").query("holiday", {
				masterId: params.master_id
			}),
			master: this.get('store').findRecord('master', params.master_id)
		});
	}
});

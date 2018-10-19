import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model(params) {
		return hash({
			workTimes: this.store.query("workTime", {
				masterId: params.master_id
			}),
			holidays: this.store.query("holiday", {
				masterId: params.master_id
			}),
			master: this.store.findRecord('master', params.master_id)
		});
	}
});

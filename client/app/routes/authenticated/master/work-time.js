import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
    model(params) {
        return hash({
            workTimes: this.get("store").query("workTime", {
                query: {
                    masterId: params.master_id
                }
            }),
            master: this.get('store').findRecord('master', params.master_id)
        });
    }
});

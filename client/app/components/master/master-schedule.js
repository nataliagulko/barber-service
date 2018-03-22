import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
    store: Ember.inject.service("store"),
    groupedWorkTimes: [],

    didInsertElement() {
        const master = this.get("master");

        let workTimesList = this.get("store").query("workTime", {
            query: {
                masterId: master.id
            }
        });

        workTimesList.then((workTimes) => {
            let groupedWorkTimes = _.groupBy(workTimes.toArray(), "data.dayOfWeek");
            this.set("groupedWorkTimes", groupedWorkTimes);
        });
    }
});

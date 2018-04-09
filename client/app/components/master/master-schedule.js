import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
    classNames: ["master-schedule"],
    store: Ember.inject.service("store"),
    pickatimeService: Ember.inject.service("pickatime-service"),
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
    },

    actions: {
        onTimeButtonClick: function (workTime) {
            const pickatimeService = this.get("pickatimeService"),
                timeFrom = workTime.get("timeFrom").split(":"),
                timeTo = workTime.get("timeTo").split(":");

            let pickerSelector = "#master-schedule__time-picker",
                rangeArr = [{
                    "from": [timeFrom[0], timeFrom[1]],
                    "to": [timeTo[0], timeTo[1]]
                }];

            pickatimeService.set(pickerSelector, "disable", false);
            pickatimeService.set(pickerSelector, "interval", 30);
            pickatimeService.set(pickerSelector, "min", [8, 0]);
            pickatimeService.set(pickerSelector, "max", [20, 0]);
            pickatimeService.set(pickerSelector, "disable", rangeArr);
        }
    }
});

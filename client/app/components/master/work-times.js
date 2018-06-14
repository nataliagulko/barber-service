import Component from '@ember/component';
import _ from 'lodash';

export default Component.extend({
    didInsertElement() {
        const workTimes = this.get("workTimes").toArray();
        let jointWorkTimes = [];

        const workingDays = this.buildWordingDays(workTimes);
        const weekend = this.buildWeekend(workTimes);
        jointWorkTimes = workingDays.concat(weekend);

        jointWorkTimes = _.sortBy(jointWorkTimes, "dayOfWeek");
        this.set("jointWorkTimes", jointWorkTimes);
    },

    buildWordingDays: function (workTimes) {
        const times = [];
        const workTimesByDayOfWeek = _.groupBy(workTimes, "data.dayOfWeek");

        _.forEach(workTimesByDayOfWeek, function (workTime) {
            let item;

            if (workTime.length > 1) {
                item = {
                    dayOfWeek: workTime[0].get("dayOfWeek"),
                    start: workTime[0].get("timeFrom"),
                    end: workTime[1].get("timeTo"),
                    lunchStart: workTime[0].get("timeTo"),
                    lunchEnd: workTime[1].get("timeFrom"),
                    checked: true
                };
            } else {
                item = {
                    dayOfWeek: workTime[0].get("dayOfWeek"),
                    start: workTime[0].get("timeFrom"),
                    end: workTime[0].get("timeTo"),
                    lunchStart: null,
                    lunchEnd: null,
                    checked: true
                };
            }

            times.push(item);
        });

        return times;
    },

    buildWeekend: function (workTimes) {
        let daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        const times = [];

        daysOfWeek.forEach((day) => {
            let dayOfWeek = _.find(workTimes, _.iteratee(['data.dayOfWeek', day]));

            if (typeof dayOfWeek === "undefined") {
                times.push({
                    dayOfWeek: day,
                    start: null,
                    end: null,
                    lunchStart: null,
                    lunchEnd: null,
                    checked: false
                });
            }
        });

        return times;
    }
});

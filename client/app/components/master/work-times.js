import Component from '@ember/component';
import _ from 'lodash';

export default Component.extend({
    didInsertElement() {
        const workTimes = this.get("workTimes").toArray();
        let modifiedWorkTimes = [];
        
        const workingDays = this.buildWordingDays(workTimes);
        const weekend = this.buildWeekend(workTimes);
        modifiedWorkTimes = workingDays.concat(weekend);
        
        modifiedWorkTimes = _.sortBy(modifiedWorkTimes, "dayOfWeek");
        this.set("modifiedWorkTimes", modifiedWorkTimes);
    },
    
    buildWordingDays: function (workTimes) {
        const times = [];
        const workTimesByDayOfWeek = _.groupBy(workTimes, "data.dayOfWeek");

        _.forEach(workTimesByDayOfWeek, function (workTime) {
            let item;

            if (workTime.length > 1) {
                const dayOfWeek = workTime[0].get("dayOfWeek");
                const start = workTime[0].get("timeFrom");
                const lunchStart = workTime[0].get("timeTo");
                const lunchEnd = workTime[1].get("timeFrom");
                const end = workTime[1].get("timeTo");
                item = { dayOfWeek, start, end, lunchStart, lunchEnd, checked: true };
            } else {
                const dayOfWeek = workTime[0].get("dayOfWeek");
                const start = workTime[0].get("timeFrom");
                const end = workTime[0].get("timeTo");
                const lunchStart = null;
                const lunchEnd = null;
                item = { dayOfWeek, start, end, lunchStart, lunchEnd, checked: true };
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
                times.push({  dayOfWeek: day, start: null, end: null, lunchStart: null, lunchEnd: null, checked: false });
            }
        });

        return times;
    }
});

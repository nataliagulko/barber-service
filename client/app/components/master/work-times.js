import Component from '@ember/component';
import _ from 'lodash';

export default Component.extend({
    didInsertElement() {
        const workTimes = this.get("workTimes").toArray();
        const workTimesByDayOfWeek = _.groupBy(workTimes, "data.dayOfWeek");
        const modifiedWorkTimes = [];

        _.forEach(workTimesByDayOfWeek, function (workTime) {
            // const dayOfWeek = workTime[0].get("dayOfWeek");
            const start = workTime[0].get("timeFrom");
            const lunchStart = workTime[0].get("timeTo");
            const lunchEnd = workTime[1].get("timeFrom");
            const end = workTime[1].get("timeTo");
            modifiedWorkTimes.push({start, end, lunchStart, lunchEnd});
        });
        
        // console.log(modifiedWorkTimes);
        this.set("modifiedWorkTimes", modifiedWorkTimes);
    }
});

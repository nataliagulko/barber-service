import Component from '@ember/component';
import _ from 'lodash';

export default Component.extend({    
    didInsertElement() {
        const workTimes = this.get("workTimes").toArray();
        const workTimesByDayOfWeek = _.groupBy(workTimes, "data.dayOfWeek");
        console.log(workTimesByDayOfWeek);
        this.set("workTimesByDayOfWeek", workTimesByDayOfWeek);
    }
});

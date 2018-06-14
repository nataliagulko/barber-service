import Component from '@ember/component';
import { inject } from '@ember/service';
import _ from 'lodash';

export default Component.extend({
    store: inject(),

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
                    ids: [workTime[0].get("id"), workTime[1].get("id")],
                    wasChanged: false,
                    checked: true
                };
            } else {
                item = {
                    dayOfWeek: workTime[0].get("dayOfWeek"),
                    start: workTime[0].get("timeFrom"),
                    end: workTime[0].get("timeTo"),
                    lunchStart: null,
                    lunchEnd: null,
                    ids: [workTime[0].get("id")],
                    wasChanged: false,
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
                    ids: null,
                    wasChanged: false,
                    checked: false
                });
            }
        });

        return times;
    },

    saveChangedWorkTimes: function (changedWorkTimes) {
        const store = this.get("store");
        const router = this.get("router");
        const master = this.get("master");

        _.forEach(changedWorkTimes, function (item) {
            if (!item.checked && item.ids.length > 0) {
                item.ids.forEach(id => {
                    store.findRecord("workTime", id, { backgroundReload: false })
                        .then((record) => {
                            record.destroyRecord();
                            router.transitionTo("master");
                        });
                });
            } else if (item.checked && !item.ids) {
                if (item.lunchEnd && item.lunchStart) {
                    // two work times
                    store.createRecord("workTime", {
                        timeFrom: item.start,
                        timeTo: item.lunchStart,
                        dayOfWeek: item.dayOfWeek,
                        master
                    })
                        .save()
                        .then(() => {
                            store.createRecord("workTime", {
                                timeFrom: item.lunchEnd,
                                timeTo: item.end,
                                dayOfWeek: item.dayOfWeek,
                                master
                            })
                                .save()
                                .then(() => {
                                    router.transitionTo("master");
                                });
                        });
                } else {
                    // one work times
                    store.createRecord("workTime", {
                        timeFrom: item.start,
                        timeTo: item.end,
                        dayOfWeek: item.dayOfWeek,
                        master
                    })
                        .save()
                        .then(() => {
                            router.transitionTo("master");
                        });
                }
            }
        });
    },

    actions: {
        saveWorkTimes: function () {
            const jointWorkTimes = this.get("jointWorkTimes");

            const changedWorkTimes = _.filter(jointWorkTimes, { "wasChanged": true });
            if (changedWorkTimes.length) {
                this.saveChangedWorkTimes(changedWorkTimes);
            } else {
                this.get("router").transitionTo("master");
            }
        }
    }
});

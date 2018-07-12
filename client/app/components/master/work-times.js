import Component from '@ember/component';
import { inject } from '@ember/service';
import _ from 'lodash';

export default Component.extend({
    store: inject(),

    didInsertElement() {
        const workTimes = this.get("workTimes").toArray();
        let jointWorkTimes = [];

        const workingDays = this._buildWordingDays(workTimes);
        const weekend = this._buildWeekend(workTimes);
        jointWorkTimes = workingDays.concat(weekend);

        jointWorkTimes = _.sortBy(jointWorkTimes, "dayOfWeek");
        this.set("jointWorkTimes", jointWorkTimes);
    },

    _buildWordingDays: function (workTimes) {
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

    _buildWeekend: function (workTimes) {
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

    _removeWorkTimes: function (item, needTransition = false) {
        const router = this.get("router");
        const store = this.get("store");

        item.ids.forEach(id => {
            store.findRecord("workTime", id, { backgroundReload: false })
                .then((record) => {
                    record.destroyRecord();
                    if (needTransition) {
                        router.transitionTo("auth.master");
                    }
                });
        });
    },

    _saveTwoWorkTimes: function (item) {
        const router = this.get("router");
        const store = this.get("store");
        const master = this.get("master");

        const record1 = store.createRecord("workTime", {
            timeFrom: item.start,
            timeTo: item.lunchStart,
            dayOfWeek: item.dayOfWeek,
            master
        });

        const record2 = store.createRecord("workTime", {
            timeFrom: item.lunchEnd,
            timeTo: item.end,
            dayOfWeek: item.dayOfWeek,
            master
        });

        record1
            .validate()
            .then(({ validations }) => {
                if (validations.get('isValid')) {
                    record1.save()
                        .then(() => {
                            record2
                                .validate()
                                .then(({ validations }) => {
                                    if (validations.get('isValid')) {
                                        record2.save()
                                            .then(() => {
                                                router.transitionTo("auth.master");
                                            });
                                    } else {
                                        this.set("errors", validations.get("errors"));
                                    }
                                });
                        });
                } else {
                    this.set("errors", validations.get("errors"));
                }
            });
    },

    _saveOneWorkTime: function (item) {
        const router = this.get("router");
        const store = this.get("store");
        const master = this.get("master");

        const record = store.createRecord("workTime", {
            timeFrom: item.start,
            timeTo: item.end,
            dayOfWeek: item.dayOfWeek,
            master
        });

        record
            .validate()
            .then(({ validations }) => {
                if (validations.get('isValid')) {
                    record.save();
                    router.transitionTo("auth.master");
                } else {
                    this.set("errors", validations.get("errors"));
                }
            });
    },

    _updateWorkTimes: function (item) {
        this._removeWorkTimes(item);
        if (item.lunchEnd && item.lunchStart) {
            this._saveTwoWorkTimes(item);
        } else {
            this._saveOneWorkTime(item);
        }
    },

    _saveChangedWorkTimes: function (changedWorkTimes) {
        const _this = this;

        _.forEach(changedWorkTimes, function (item) {
            if (!item.checked && item.ids.length > 0) {
                _this._removeWorkTimes(item, true);
            } else if (item.checked && !item.ids) {
                if (item.lunchEnd || item.lunchStart) {
                    _this._saveTwoWorkTimes(item);
                } else {
                    _this._saveOneWorkTime(item);
                }
            } else if (item.checked && item.ids) {
                _this._updateWorkTimes(item);
            }
        });
    },

    actions: {
        saveWorkTimes: function () {
            const jointWorkTimes = this.get("jointWorkTimes");
            const changedWorkTimes = _.filter(jointWorkTimes, { "wasChanged": true });

            if (changedWorkTimes.length) {
                this._saveChangedWorkTimes(changedWorkTimes);
            } else {
                this.get("router").transitionTo("auth.master");
            }
        }
    }
});

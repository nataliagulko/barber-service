import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
    classNames: ["master-schedule"],
    store: Ember.inject.service("store"),
    pickatimeService: Ember.inject.service("pickatime-service"),
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    isWorkDay: true,

    _setTargetButtonActive: function (e) {
        Ember.$(".master-schedule__btn").removeClass('active');
        Ember.$(e.target).addClass("active");
    },

    _toggleTimePicker: function (workTimesByDay) {
        const pickatimeService = this.get("pickatimeService"),
            pickerSelector = "#master-schedule__time-picker";

        if (workTimesByDay && workTimesByDay.length) {
            let rangeArr = [];

            this.set("isWorkDay", true);

            workTimesByDay.forEach(function (workTime) {
                const timeFrom = workTime.get("timeFrom").split(":"),
                    timeTo = workTime.get("timeTo").split(":");

                rangeArr.push({
                    "from": [timeFrom[0], timeFrom[1]],
                    "to": [timeTo[0], timeTo[1]]
                });
            });
            
            pickatimeService.init();
            pickatimeService.set(pickerSelector, "disable", false);
            pickatimeService.set(pickerSelector, "interval", 15);
            pickatimeService.set(pickerSelector, "min", [8, 0]);
            pickatimeService.set(pickerSelector, "max", [20, 0]);
            pickatimeService.set(pickerSelector, "disable", rangeArr);
        } else {
            pickatimeService.stop(pickerSelector);
            this.set("isWorkDay", false);
        }
    },

    actions: {
        onTimeButtonClick: function (day, e) {
            const workTimes = this.get("workTimes").toArray();

            let workTimesByDay = _.filter(workTimes, function (workTime) {
                return workTime.get("dayOfWeek") === day;
            });

            this._toggleTimePicker(workTimesByDay);
            this._setTargetButtonActive(e);
        }
    }
});


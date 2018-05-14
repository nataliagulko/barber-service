import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
    classNames: ["master-schedule"],
    store: Ember.inject.service("store"),
    pickatimeService: Ember.inject.service("pickatime-service"),
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    currentWorkTimes: [],
    isDayEmpty: false,

    didInsertElement() {
        this.send("onDaySelect", 1);
    },

    _setTargetButtonActive: function (day) {
        Ember.$(".master-schedule__day-of-week").removeClass('active');
        Ember.$(`.master-schedule__day-of-week_${day}`).addClass("active");
    },

    _toggleTimePicker: function (workTimesByDay) {
        const pickatimeService = this.get("pickatimeService"),
            pickerSelector = "#master-schedule__time-picker";

        pickatimeService.stop(pickerSelector);
        pickatimeService.init();
        pickatimeService.set(pickerSelector, "interval", 15);
        pickatimeService.set(pickerSelector, "min", [8, 0]);
        pickatimeService.set(pickerSelector, "max", [20, 0]);
    },

    actions: {
        onDaySelect: function (day) {
            const workTimes = this.get("workTimes").toArray();

            let workTimesByDay = _.filter(workTimes, function (workTime) {
                return workTime.get("dayOfWeek") === day;
            });

            if (workTimesByDay && workTimesByDay.length) {
                this.set("isDayEmpty", false);
                this.set("currentWorkTimes", workTimesByDay);
            } else {
                this.set("isDayEmpty", true);
                this.set("currentWorkTimes", []);
            }

            this._toggleTimePicker(workTimesByDay);
            this._setTargetButtonActive(day);
        },

        onTimeChange: function (time) {
            console.log(time);
        }
    }
});


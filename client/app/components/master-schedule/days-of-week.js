import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['master-schedule__days'],

    didInsertElement() {
        this.send("onDaySelect", 1);
    },

    _setTargetButtonActive: function (day) {
        Ember.$(".master-schedule__day-of-week").removeClass('active');
        Ember.$(`.master-schedule__day-of-week_${day}`).addClass("active");
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

            this._setTargetButtonActive(day);
        },
    }
});

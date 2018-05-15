import Ember from 'ember';
import _ from 'lodash';
import moment from 'moment';

export default Ember.Component.extend({
    classNames: ['master-schedule__days'],

    didInsertElement() {
        this.send("onDaySelect", 1);
    },

    _setTargetButtonActive: function (day) {
        Ember.$(".master-schedule__day-of-week").removeClass('active');
        Ember.$(`.master-schedule__day-of-week_${day}`).addClass("active");
    },

    _converTimeToDecimal: function (time) {
        let timeAr = time.split(":");
        let hours = Number(timeAr[0]);
        let decimalPart = timeAr[1] * 60 / 3600;

        return parseFloat(`${hours}.${decimalPart}`).toFixed(2);
    },

    _convertDecimalToTime: function (float) {
        let floatAr = float.split(".");
        let hours = floatAr[0];
        let minutes = floatAr[1] * 3600 / 60;
        minutes = moment(minutes).format("mm");

        return `${hours}:${minutes}`;
    },

    actions: {
        onDaySelect: function (day) {
            const workTimes = this.get("workTimes").toArray(),
            _this = this;

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

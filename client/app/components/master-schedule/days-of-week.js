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
        let hours = timeAr[0];
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

    _setTimes: function (workTimes) {
        const _this = this;
        const min = _this._converTimeToDecimal("08:00");
        const max = _this._converTimeToDecimal("20:00");
        const diff = max - min;

        let times = [];

        workTimes.forEach((wt, ind) => {
            let timeFrom = _this._converTimeToDecimal(wt.get("timeFrom"));
            let timeTo = _this._converTimeToDecimal(wt.get("timeTo"));
            let previousVal = 0;

            console.log("*** ind ***", ind);

            if (ind === 0) {
                times.push(_this._createInterval(min - timeFrom, min, diff));
                times.push(_this._createInterval(timeTo - timeFrom, min, diff));
            } else if (ind % 2) {
                times.push(_this._createInterval(timeFrom - timeTo, min, diff));
            } else {
                times.push(_this._createInterval(timeTo - timeFrom, min, diff));
            }
        });

        this.set("times", times);
    },

    _createInterval: function (countOfHours, min, diff, cssClass) {
        let now = parseFloat(countOfHours / diff * 100).toFixed(0);
        let css = cssClass || "progress-bar-info";
        console.log("countOfHours", countOfHours);
        console.log("now", now);

        let interval = { now, css };

        return interval;
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
                _this._setTimes(workTimesByDay);
            } else {
                this.set("isDayEmpty", true);
                this.set("currentWorkTimes", []);
            }

            this._setTargetButtonActive(day);
        },
    }
});

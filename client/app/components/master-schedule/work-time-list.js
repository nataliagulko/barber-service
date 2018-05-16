import Ember from 'ember';
import _ from 'lodash';
import moment from 'moment';

export default Ember.Component.extend({
    pickatimeService: Ember.inject.service("pickatime-service"),

    didInsertElement() {
        let workTimes = this.get("workTimes");
        this.send("buildTimesGroupedByDayOfWeek", workTimes);
    },

    converTimeToDecimal: function (time) {
        let timeAr = time.split(":");
        let hours = timeAr[0];
        let decimalPart = timeAr[1] * 60 / 3600;

        return parseFloat(`${hours}.${decimalPart}`).toFixed(2);
    },

    convertDecimalToTime: function (float) {
        let floatAr = float.split(".");
        let hours = floatAr[0];
        let minutes = floatAr[1] * 3600 / 60;
        minutes = moment(minutes).format("mm");

        return `${hours}:${minutes}`;
    },

    buildTimeItem: function (wt, min, diff, times, savedTimeValue, ind) {
        let timeFrom = this.converTimeToDecimal(wt.get("timeFrom"));
        let timeTo = this.converTimeToDecimal(wt.get("timeTo"));
        let timeRange = wt.get("timeRange");
        let dayOfWeek = wt.get("dayOfWeek");

        if (ind === 0) {
            // на первом шаге надо вычислить начальную точку timeFrom - min
            times.push(this.createInterval(timeFrom - min, min, diff, timeRange, dayOfWeek, "progress-bar-empty"));
            times.push(this.createInterval(timeTo - timeFrom, min, diff, timeRange, dayOfWeek));
            savedTimeValue = timeTo;
        } else {
            times.push(this.createInterval(timeFrom - savedTimeValue, min, diff, timeRange, dayOfWeek, "progress-bar-empty"));
            times.push(this.createInterval(timeTo - timeFrom, min, diff, timeRange, dayOfWeek));
            savedTimeValue = timeTo;
        }

        return savedTimeValue;
    },

    createInterval: function (countOfHours, min, diff, range, dayOfWeek, cssClass) {
        let now = Math.round(countOfHours / diff * 100);
        let css = cssClass || "progress-bar-info";
        range = cssClass ? null : range;

        let interval = { now, css, range, dayOfWeek };

        return interval;
    },

    buildWorkDayTimeItem: function (workTimesAr, times) {
        const _this = this;
        const min = _this.converTimeToDecimal("08:00"); // время начала работы организации
        const max = _this.converTimeToDecimal("20:00"); // время окончания
        const diff = max - min;

        let workTimesByDayOfWeek = _.groupBy(workTimesAr, "data.dayOfWeek");

        _.forEach(workTimesByDayOfWeek, (wts) => {
            let savedTimeValue = null;

            wts.forEach(function (wt, ind) {
                savedTimeValue = _this.buildTimeItem(wt, min, diff, times, savedTimeValue, ind);
            });
        });
    },

    buildWeekendTimeItem: function (workTimesAr, times) {
        const _this = this;
        let daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

        daysOfWeek.forEach((day) => {
            let d = _.find(workTimesAr, _.iteratee(['data.dayOfWeek', day]));

            if (typeof d === "undefined") {
                times.push(_this.createInterval(0, 0, 1, null, day, "progress-bar-empty"));
            }
        });
    },

    actions: {
        buildTimesGroupedByDayOfWeek: function (workTimes) {
            const workTimesAr = workTimes.toArray();

            let times = [];

            this.buildWorkDayTimeItem(workTimesAr, times);
            this.buildWeekendTimeItem(workTimesAr, times);

            times = _.groupBy(times, "dayOfWeek");
            this.set("times", times);
        },

        setTimeByDay: function (day, times) {
            const pickatimeService = this.get("pickatimeService"),
                pickerSelector = "#master-schedule__time-picker";

            this.set("selectedDayOfWeek", day);
            Ember.$(".master-schedule__time").removeClass("hidden");

            // pickatimeService.stop(pickerSelector);
            // pickatimeService.init();
            pickatimeService.set(pickerSelector, "interval", 15);
            pickatimeService.set(pickerSelector, "min", [8, 0]);
            pickatimeService.set(pickerSelector, "max", [20, 0]);
        }
    }
});
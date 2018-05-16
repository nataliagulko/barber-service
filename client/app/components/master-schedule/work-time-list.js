import Ember from 'ember';
import _ from 'lodash';
import moment from 'moment';

export default Ember.Component.extend({
    didInsertElement() {
        let workTimes = this.get("workTimes");
        this._setTimes(workTimes);
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

        let groupedWorkTimes = _.groupBy(workTimes.toArray(), "data.dayOfWeek");

        _.forEach(groupedWorkTimes, (wts) => {
            let savedTimeValue = null;

            wts.forEach(function (wt, ind) {
                savedTimeValue = _this._getWorktimes(wt, min, diff, times, savedTimeValue, ind);
            });
        });

        times = _.groupBy(times, "dayOfWeek");
        this.set("times", times);
    },

    _getWorktimes: function (wt, min, diff, times, savedTimeValue, ind) {
        let timeFrom = this._converTimeToDecimal(wt.get("timeFrom"));
        let timeTo = this._converTimeToDecimal(wt.get("timeTo"));
        let timeRange = wt.get("timeRange");
        let dayOfWeek = wt.get("dayOfWeek");

        if (ind === 0) {
            // на первом шаге надо вычислить начальную точку timeFrom - min
            times.push(this._createInterval(timeFrom - min, min, diff, timeRange, dayOfWeek, "progress-bar-empty"));
            times.push(this._createInterval(timeTo - timeFrom, min, diff, timeRange, dayOfWeek));
            savedTimeValue = timeTo;
        } else {
            times.push(this._createInterval(timeFrom - savedTimeValue, min, diff, timeRange, dayOfWeek, "progress-bar-empty"));
            times.push(this._createInterval(timeTo - timeFrom, min, diff, timeRange, dayOfWeek));
            savedTimeValue = timeTo;
        }

        return savedTimeValue;
    },

    _createInterval: function (countOfHours, min, diff, range, dayOfWeek, cssClass) {
        let now = parseFloat(countOfHours / diff * 100).toFixed(0);
        let css = cssClass || "progress-bar-info";
        range = cssClass ? null : range;

        let interval = { now, css, range, dayOfWeek };

        return interval;
    },
});
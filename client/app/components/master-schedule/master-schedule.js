import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
    classNames: ["master-schedule"],
    store: Ember.inject.service("store"),
    pickatimeService: Ember.inject.service("pickatime-service"),
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    currentWorkTimes: [],
    isDayEmpty: false,

    _toggleTimePicker: function (workTimesByDay) {
        const pickatimeService = this.get("pickatimeService"),
            pickerSelector = "#master-schedule__time-picker";

        pickatimeService.stop(pickerSelector);
        pickatimeService.init();
        pickatimeService.set(pickerSelector, "interval", 15);
        pickatimeService.set(pickerSelector, "min", [8, 0]);
        pickatimeService.set(pickerSelector, "max", [20, 0]);
    }
});


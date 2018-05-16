import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['master-schedule__time', 'col-md-6', 'hidden'],
    store: Ember.inject.service(),
    message: "Выберите время начала",
    workTimeRecord: null,

    createWorkTimeRecord: function (time) {
        let record = this.get("store").createRecord("workTime");
        record.set("timeFrom", time);
        record.set("dayOfWeek", this.get("selectedDayOfWeek"));

        this.set("message", "Выберите дату окончания");
        this.set("workTimeRecord", record);
    },

    actions: {
        onTimeChange: function (time) {
            let record = this.get("workTimeRecord");

            if (time) {
                if (record) {
                    if (!record.get("timeTo") && time > record.get("timeFrom")) {
                        record.set("timeTo", time);
                        this.set("message", "Период добавлен");                        
                    } else {
                        this.set("message", "Дата окончания должна быть больше даты начала");                        
                    }
                } else {
                    this.createWorkTimeRecord(time);
                }
            } else {
                console.log("Была нажата кнопка Очистить");
            }

            console.log(this.get("workTimeRecord"));
        },

        saveWorkTimes: function () {

        }
    }
});

import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['master-schedule__time', 'col-md-6', 'hidden'],
    store: Ember.inject.service(),
    pickatimeService: Ember.inject.service("pickatime-service"),
    notification: Ember.inject.service("notification-service"),
    message: "Выберите время начала",
    workTimeRecord: null,

    createWorkTimeRecord: function (time) {
        let record = this.get("store").createRecord("workTime");
        record.set("master", this.get("master"));
        record.set("timeFrom", time);
        record.set("dayOfWeek", this.get("selectedDayOfWeek"));

        this.set("message", "Выберите дату окончания");
        this.set("workTimeRecord", record);
    },

    disableTimePicker: function (record) {
        const pickatimeService = this.get("pickatimeService");
        const pickerSelector = "#master-schedule__time-picker";
        const timeFrom = record.get("timeFrom").split(":");
        const timeTo = record.get("timeTo").split(":");
        const disabledRange = {
            from: [timeFrom[0], timeFrom[1]],
            to: [timeTo[0], timeTo[1]]
        };

        console.log(disabledRange);

        pickatimeService.set(pickerSelector, "disable", [disabledRange]);
    },

    actions: {
        onTimeChange: function (time) {
            let record = this.get("workTimeRecord");

            if (time) {
                if (record) {
                    if (!record.get("timeTo") && time > record.get("timeFrom")) {
                        record.set("timeTo", time);
                        this.disableTimePicker(record);
                        this.set("message", "Нажмите Сохранить для добавления периода");
                    } else {
                        this.set("message", "Дата окончания должна быть больше даты начала");
                    }
                } else {
                    this.createWorkTimeRecord(time);
                }
            } else {
                console.log("Была нажата кнопка Очистить");
            }
        },

        saveWorkTime: function () {
            const record = this.get("workTimeRecord");
            const _this = this;

            record
                .validate()
                .then(({ validations }) => {
                    if (validations.get('isValid')) {
                        record
                            .save()
                            .then(() => {
                                let message = `Период создан`;

                                _this.get("notification").showInfoMessage(message);
                                // _this.get("router").refresh();
                            });
                    }
                }, () => {
                });
        }
    }
});

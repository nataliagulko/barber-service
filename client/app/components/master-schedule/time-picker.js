import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['master-schedule__time', 'col-md-6', 'hidden'],
    store: Ember.inject.service(),
    message: "Выберите время начала",
    workTimeRecord: null,
    pickatimeService: Ember.inject.service("pickatime-service"),
    notification: Ember.inject.service("notification-service"),

    createWorkTimeRecord: function (time) {
        let record = this.get("store").createRecord("workTime");
        record.set("master", this.get("master"));
        record.set("timeFrom", time);
        record.set("dayOfWeek", this.get("selectedDayOfWeek"));

        this.set("message", "Выберите дату окончания");
        this.set("workTimeRecord", record);
    },

    disableTimePicker: function (time) {
        const pickatimeService = this.get("pickatimeService");
        const pickerSelector = "#master-schedule__time-picker";
        const timeAr = time.split(":");
        const hours = timeAr[0];
        const minutes = timeAr[1];

        console.log(time);

        pickatimeService.set(pickerSelector, "disable", [hours, minutes]);
    },

    actions: {
        onTimeChange: function (time) {
            let record = this.get("workTimeRecord");

            if (time) {
                if (record) {
                    if (!record.get("timeTo") && time > record.get("timeFrom")) {
                        record.set("timeTo", time);
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

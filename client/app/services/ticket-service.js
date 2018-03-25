import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
    store: Ember.inject.service("store"),
    pickadateService: Ember.inject.service("pickadate-service"),
    pickatimeService: Ember.inject.service("pickatime-service"),
    selectedMaster: null,
    ticketDate: null,
    ticketTime: null,
    servicesByMaster: [],
    selectedServices: [],
    cost: null,
    duration: null,
    phone: "",
    client: null,
    activeStep: '#master-step',

    changeStep(step) {
        // скрываем верхнюю половину блока "инфо"
        // $('.ticket-info-top').addClass('hidden');
        this.set("activeStep", step);

        //показываем слева инфу того блока на котором находимся
        // $(infoToShow).removeClass('hidden');

        // отображаем нижние строки блока "инфо" если они не пустые
        // let bottomItems = $('.ticket-info-bottom');

        // bottomItems.each(function () {
        //     let isNotEmpty = $(this).find('.ticket-info-bottom__text').text().trim();
        //     if (isNotEmpty) {
        //         $(this).removeClass('hidden');
        //     }
        // });

        // // убираем активное состояние со всех шагов и добавляем выбранному
        $('.mt-step-col').removeClass('active');
        $(step).addClass('active');

        // // скрываем правые панельки и отображаем выбранную
        // $('.right-panel').addClass('hidden');
        // $(elemToShow).removeClass('hidden');

        // // если на шаге "Клиент" то отображаем блок с маской телефона
        // if ($('#client-step').hasClass('active')) {
        //     $('.ticket-info-client-top').removeClass('hidden');
        // }
    },

    toggleMaster(master, event) {
        let selectedItem = $(event.target).closest('.tile'),
            selectedMaster = this.get("selectedMaster"),
            isSameMaster = selectedMaster === master;

        if (selectedMaster && isSameMaster) {
            this.set("selectedMaster", null);
            this.set("servicesByMaster", []);

            $('.ticket-info-master-top').addClass('hidden');
        }
        else if (selectedMaster && !isSameMaster) {
            this._setSelectedMaster(master);

            $('.tile').each(function () {
                $(this).removeClass('selected');
            });
        }
        else {
            this._setSelectedMaster(master);
        }

        $(selectedItem).toggleClass('selected');
    },

    _setSelectedMaster(master) {
        this.set("selectedMaster", master);
        this._getServicesByMaster(master);
        $('.ticket-info-master-top').removeClass('hidden');
    },

    _getServicesByMaster(master) {
        let store = this.get("store"),
            _this = this;

        let services = store.query("service", {
            query: {
                masterId: master.id
            }
        });

        services.then(function () {
            _this.set("servicesByMaster", services);
        });
    },

    toggleServiceItem(service, event) {
        let selectedItem = $(event.target).closest('.tile'),
            selectedServices = this.get("selectedServices"),
            isServiceIncluded = selectedServices.includes(service);

        if (isServiceIncluded) {
            selectedServices.removeObject(service);
        }
        else {
            selectedServices.pushObject(service);
        }

        if (selectedServices.get("length") === 0) {
            $('.ticket-info-services-top').addClass('hidden');
        }
        else {
            $('.ticket-info-services-top').removeClass('hidden');
        }


        this._calculateDurationAndCost();
        this._getHolidays();

        $(selectedItem).toggleClass('selected');
    },

    _calculateDurationAndCost() {
        let selectedServices = this.get("selectedServices"),
            totalCost = 0,
            totalDuration = 0;

        selectedServices.forEach(function (item) {
            totalCost += item.get("cost");
            totalDuration += item.get("time");
        });
        this.set("cost", totalCost);
        this.set("duration", totalDuration);
    },

    _getHolidays() {
        let store = this.get("store"),
            _this = this,
            master = this.get("selectedMaster"),
            duration = this.get("duration"),
            pickadateService = this.get("pickadateService");

        let holidays = store.query("holiday", {
            query: {
                masterId: master.id,
                time: duration
            }
        });

        holidays.then(function () {
            holidays = holidays.toArray();
            let disableDates = _this._parseHolidays(holidays),
                yesterday = moment().subtract(1, 'days');

            pickadateService.set("#ticket-date-picker", "disable", false);
            pickadateService.set("#ticket-date-picker", "min", yesterday);
            pickadateService.set("#ticket-date-picker", "disable", disableDates);
        });
    },

    _parseHolidays(holidays) {
        let datesArr = [];

        holidays.forEach(function (item) {
            const dateFrom = moment(item.get("dateFrom")).toObject(),
                dateTo = moment(item.get("dateTo")).toObject();

            let range = {
                "from": [dateFrom.years, dateFrom.months, dateFrom.date],
                "to": [dateTo.years, dateTo.months, dateTo.date]
            };

            datesArr.push(range);
        });

        return datesArr;
    },

    onTicketDateChange(selectedDate) {
        let store = this.get("store"),
            master = this.get("selectedMaster"),
            duration = this.get("duration"),
            date = selectedDate,
            _this = this,
            pickatimeService = this.get("pickatimeService");

        $('.ticket-info-date-top').removeClass('hidden');
        this.set("ticketDate", date);

        let slots = store.query("slot", {
            query: {
                masterId: master.id,
                time: duration,
                slotDate: date
            },
        });

        slots.then((timeSlots) => {
            timeSlots = timeSlots.toArray();
            if (timeSlots.length === 0) { return; }

            let parsedSlots = _this._parsedSlots(timeSlots);

            pickatimeService.set("#ticket-time-picker", "disable", false);
            pickatimeService.set("#ticket-time-picker", "min", parsedSlots.disabledMinTime);
            pickatimeService.set("#ticket-time-picker", "max", parsedSlots.disabledMaxTime);
            pickatimeService.set("#ticket-time-picker", "disable", parsedSlots.disabledTimeSlots);
        })
    },

    _parsedSlots(timeSlots) {
        let timesArr = [],
            minTime = 0,
            maxTime = 0;

        timeSlots.forEach(function (item) {
            const start = moment(item.get("start")).toObject(),
                end = moment(item.get("end")).toObject();

            var rangeObj = {
                "from": [start.hours, start.minutes],
                "to": [end.hours, end.minutes]
            };

            timesArr.push(rangeObj);
        });

        minTime = timesArr[0].to;
        maxTime = timesArr[timesArr.length - 1].from;

        return {
            disabledTimeSlots: timesArr,
            disabledMinTime: minTime,
            disabledMaxTime: maxTime,
        };
    },

    onTicketTimeChange(selectedTime) {
        $('.ticket-info-time-top').removeClass('hidden');
        this.set("ticketTime", selectedTime);
    },

    inputPhone(value) {
        let phone = this.get("phone");

        const phoneLength = 10;

        phone += value;
        this.set("phone", phone);

        if (phone.length === phoneLength) {
            this._getClient(phone);
        }
    },

    _getClient(phone) {
        const store = this.get("store");

        let client = store.queryRecord("client", {
            query: {
                phone: phone
            },
        });
        this.set("client", client);
    }
});
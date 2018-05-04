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
    clientName: "",
    isNewClient: false,
    activeStep: '#master-step',
    
    changeStep(step) {
        this.set("activeStep", step);

        // убираем активное состояние со всех шагов и добавляем выбранному
        $('.mt-step-col').removeClass('active');
        $(step).addClass('active');
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
            // this._setSelectedMaster(master);
            this.set("selectedMaster", master);            

            $('.tile').each(function () {
                $(this).removeClass('selected');
            });
        }
        else {
            // this._setSelectedMaster(master);
            this.set("selectedMaster", master);            
        }

        $(selectedItem).toggleClass('selected');
    },

    // _setSelectedMaster(master) {
    //     this.set("selectedMaster", master);
    //    // this._getServicesByMaster(master);
    //     // $('.ticket-info-master-top').removeClass('hidden');
    // },

    getServicesByMaster() {
        let store = this.get("store"),
            master = this.get("selectedMaster"),
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
        // this._getHolidays();

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

    getHolidays() {
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
        let date = selectedDate;
        this.set("ticketDate", date);
    },

    getTimeSlots() {
        let store = this.get("store"),
            master = this.get("selectedMaster"),
            duration = this.get("duration"),
            date = this.get("ticketDate"),
            _this = this,
            pickatimeService = this.get("pickatimeService");

        // $('.ticket-info-date-top').removeClass('hidden');

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
        });
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

        //todo подумать как сделать без двух if
        if (phone.length < phoneLength) {
            phone += value;
            this.set("phone", phone);
        }

        if (phone.length === phoneLength) {
            this._getClient(phone);
        }
    },

    removeLastNumber() {
        let phone = this.get("phone");

        this.set("phone", phone.slice(0, -1)); //почему-то если написать phone.slice(0,-1) строкой выше и сюда передавать просто phone то оно не работает
        this._resetClient();        
    },

    clearPhoneNumber() {
        this.set("phone", "");
        this._resetClient();
    },

    _resetClient() {
        this.set("client", null);
        this.set("isNewClient", false);                        
    },

    _getClient(phone) {
        const store = this.get("store"),
            _this = this;

        let client = store.queryRecord("client", {
            query: {
                phone: phone
            },
        });

        client.then(
            (c) => {
                _this.set("isNewClient", false);                
                _this.set("client", c);
            },
            () => {
                _this.set("isNewClient", true);
                _this.set("client", null);
            });
    },

    setClientName(name) {
        this.set("clientName", name);
    }
});
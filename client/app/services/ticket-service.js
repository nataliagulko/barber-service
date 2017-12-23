import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service("store"),
    pickadateService: Ember.inject.service("pickadate-service"),
    selectedMaster: null,
    servicesByMaster: [],
    selectedServices: [],
    cost: null,
    time: null, 

    showElement(elemSelector, step) {
        // скрываем верхнюю половину блока "инфо"
        $('.ticket-info-top').addClass('hidden');

        // отображаем нижние строки блока "инфо" если они не пустые
        var bottomItems = $('.ticket-info-bottom');

        bottomItems.each(function () {
            var isNotEmpty = $(this).find('.ticket-info-bottom__text').text().trim();
            if (isNotEmpty) {
                $(this).removeClass('hidden');
            }
        });

        // убираем активное состояние со всех шагов и добавляем выбранному
        $('.mt-step-col').removeClass('active');
        $(step).addClass('active');

        // скрываем правые панельки и отображаем выбранную
        $('.right-panel').addClass('hidden');
        $(elemSelector).removeClass('hidden');

        // если на шаге "Клиент" то отображаем блок с маской телефона
        if ($('#client-step').hasClass('active')) {
            $('.ticket-info-client-top').removeClass('hidden');
        }
    },

    toggleMaster(master, event) {
        var selectedItem = $(event.target).closest('.tile'),
            selectedMaster = this.get("selectedMaster"),
            isSameMaster = selectedMaster === master;

        if (selectedMaster && isSameMaster) {
            this.set("selectedMaster", null);
            this.set("servicesByMaster", []);
            
            $('.ticket-info-master-top').addClass('hidden');
        }
        else if(selectedMaster && !isSameMaster) {
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
        var store = this.get("store"),
            _this = this;

        var services = store.query("service", {
            query: {
                masterId: master.id
            }
        });

        services.then(function () {
            _this.set("servicesByMaster", services);
        })
    },

    toggleServiceItem(service, event) {
        var selectedItem = $(event.target).closest('.tile'),
            selectedServices = this.get("selectedServices"),
            isServiceIncluded = selectedServices.includes(service);

        if (isServiceIncluded) {
            selectedServices.removeObject(service);
        }
        else {
            selectedServices.pushObject(service);
        }

        if (selectedServices.get("length") == 0) {
            $('.ticket-info-services-top').addClass('hidden');
        }
        else {
            $('.ticket-info-services-top').removeClass('hidden');            
        }

        this._calculateTimeAndCost();
        this._getHolidays();

        $(selectedItem).toggleClass('selected');
    },

    _calculateTimeAndCost() {
        var selectedServices = this.get("selectedServices"),
            totalCost = 0,
            totalTime = 0;
            //todo computedproperties

        selectedServices.forEach(function (item) {
            totalCost += item.get("cost");
            totalTime += item.get("time");
        });
        this.set("cost", totalCost);
        this.set("time", totalTime);
    },

    _getHolidays() {
        var store = this.get("store"),
            _this = this,
            master = this.get("selectedMaster"),
            time = this.get("time"),
            pickadateService = this.get("pickadateService");

        var holidays = store.query("holiday", {
            query: {
                masterId: master.id,
                time: time
            }
        });
        

        holidays.then(function () {
            var disableDates = _this._parseHolidays(holidays);
            
            pickadateService.set("#ticket-date-picker", "disable", false);
            pickadateService.set("#ticket-date-picker", "min", new Date());            
            pickadateService.set("#ticket-date-picker", "disable", disableDates);
            pickadateService.on("#ticket-date-picker", "set", function (selectedDate) {
                var objDate = new Date(selectedDate.select),
                    locale = "ru-ru",
                    ticketDate = objDate.toLocaleString(locale, { day: "numeric", month: "long" });

                $('.ticket-info-date-top').removeClass('hidden');
                $('.ticket-info-date-top__date').text(ticketDate);
                $('.ticket-info-date__date').text(ticketDate);
            });
        })
    },

    _parseHolidays(holidays) {
        var datesArr = [],
            holidays = holidays.toArray();
        
        holidays.forEach(function (item) {
            var startY = moment(item.get("dateFrom")).toObject().years,
                startM = moment(item.get("dateFrom")).toObject().months,
                startD = moment(item.get("dateFrom")).toObject().date,
                endY = moment(item.get("dateTo")).toObject().years,
                endM = moment(item.get("dateTo")).toObject().months,
                endD = moment(item.dateTo).toObject().date,
                range = {
                    "from": [startY, startM, startD],
                    "to": [endY, endM, endD]
                };

            datesArr.push(range);
        });

        return datesArr;
    }
});

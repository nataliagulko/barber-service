import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service("store"),
    selectedMaster: null,
    servicesByMaster: [],
    selectedServices: [],

    showElement(elemSelector, step) {
        // скрываем верхнюю половину блока "инфо"
        $('.ticket-info-top').addClass('hidden');

        // отображаем нижние строки блока "инфо" если они не пустые
        var bottomItems = $('.ticket-info-bottom');

        bottomItems.each(function () {
            if ($(this).find('.ticket-info-bottom__text').text()) {
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

    toggleMaster(master) {
        var selectedItem = $(event.target).closest('.tile'),
            selectedMaster = this.get("selectedMaster");

        if (selectedMaster) {
            this.set("selectedMaster", null)
            this.set("servicesByMaster", []);
            $('.ticket-info-master-top').addClass('hidden');
        }
        else {
            this.set("selectedMaster", master)
            this._getServicesByMaster(master);
            $('.ticket-info-master-top').removeClass('hidden');
        }

        $(selectedItem).toggleClass('selected');
    },

    _getServicesByMaster(master) {
        var store = this.get("store"),
            _this = this;

        var services = store.query("service", {
            query: {
                master: master
            }
        });

        services.then(function () {
            _this.set("servicesByMaster", services);
        })
    },

    toggleServiceItem(service) {
        var selectedItem = $(event.target).closest('.tile'),
            selectedServices = this.get("selectedServices"),
            isServiceIncludes = selectedServices.includes(service);

        if (isServiceIncludes) {
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
        console.log("Time: ", totalTime);
        console.log("Cost: ", totalCost);
    }
});

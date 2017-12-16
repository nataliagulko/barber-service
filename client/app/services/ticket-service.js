import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service("store"),
    formFields: {
        // master: "[name=master]",
        client: "[name=client]",
        ticketDate: "[name=ticketDate]",
        time: "[name=time]",
        status: "[name=status]",
        cost: "[name=cost]",
        duration: "[name=duration]",
        services: "[name=services]",
    },
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

    selectMaster(master, event) {
        var selectedItem = $(event.target).closest('.tile');

        this.set("selectedMaster", master);
        this._getServicesByMaster(master);

        $('.ticket-info-master-top').removeClass('hidden');
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

    selectServiceItem(service) {
        var selectedItem = $(event.target).closest('.tile'),
            selectedServices = this.get("selectedServices");

        selectedServices.pushObject(service);

        $('.ticket-info-services-top').removeClass('hidden');
        $(selectedItem).toggleClass('selected');
    }
});

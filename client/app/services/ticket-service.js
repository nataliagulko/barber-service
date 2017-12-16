import Ember from 'ember';

export default Ember.Service.extend({
    formFields: {
        master: "[name=master]",
        client: "[name=client]",
        ticketDate: "[name=ticketDate]",
        time: "[name=time]",
        status: "[name=status]",
        cost: "[name=cost]",
        duration: "[name=duration]",
        services: "[name=services]",
        selectedMaster: null,
        selectedServices: []
    },

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
        var selectedItem = $(event.target).closest('.tile'),
            selectedMaster = this.get("selectedMaster");

        this.set("selectedMaster", master);

        $('.ticket-info-master-top').removeClass('hidden');

        $(selectedItem).toggleClass('selected');
    },

    selectServiceItem(service) {
        var serviceJSON = service.toJSON({ includeId: true });
        var fields = this.get("formFields");

        $('.ticket-info-services-top').removeClass('hidden');

        var selectedItem = $(event.target).closest('.tile');
        console.log(selectedItem);

        if (!$(selectedItem).hasClass('selected')) {
            $('.ticket-info-services-top ul').append('<li>' + serviceJSON.name + '</li>');
        } else {
            $('.ticket-info-services-top ul').find('li').filter(function () {
                return $.text([this]) === serviceJSON.name;
            }).remove();
        }

        $('.ticket-info-services__text ul').remove();
        $('.ticket-info-services-top ul').clone().appendTo('.ticket-info-services__text');
        $(selectedItem).toggleClass('selected');
    }
});

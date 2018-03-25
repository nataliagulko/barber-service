import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    ticketService: Ember.inject.service("ticket-service"),

    actions: {
        removeLastNumber() {
            var ticketService = this.get('ticketService');
            ticketService.removeLastNumber();
        }
    }

    // actions: {
    //     removeLastNumber() {
    //         let phonenumber = this.get("phone");
    //         phonenumber.slice(0,-1);

    //         this.set("phone", phonenumber);



    //         // var inputField = $('.ticket-info-client-top__input'),
    //         //     inputValue = $('#phone-number'),
    //         //     bottomInput = $('.ticket-info-client__phone'),
    //         //     phoneValue = $(inputValue).val();

    //         //     phoneValue = phoneValue.slice(0,-1);
    //         //     $(inputValue).val(phoneValue);
    //         //     $(inputField).text(phoneValue);
    //         //     $(bottomInput).text(phoneValue);
    //     }
    // }
});
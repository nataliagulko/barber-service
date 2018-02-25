import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',

    actions: {
        removeLastNumber() {
            var inputField = $('.ticket-info-client-top__input'),
                inputValue = $('#phone-number'),
                bottomInput = $('.ticket-info-client__phone'),
                phoneValue = $(inputValue).val();

                phoneValue = phoneValue.slice(0,-1);
                $(inputValue).val(phoneValue);
                $(inputField).text(phoneValue);
                $(bottomInput).text(phoneValue);
        }
    }
});
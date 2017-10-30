import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',

    actions: {
        inputNumber() {
            var inputField = $('.ticket-info-client-temp__input'),
                inputValue = $('#phone-number'),
                bottomInput = $('.ticket-info-client__phone'),
                phoneValue = "",
                submitBtn = $('#phone-submit');

            if ($(inputValue).val().length<10) {
                phoneValue = $(inputValue).val() + this.value;
                $(inputValue).val(phoneValue);
                $(inputField).text(phoneValue);
                $(bottomInput).text(phoneValue);
            }

            if (phoneValue.length === 10) {
                $(submitBtn).removeAttr('disabled');
                $(submitBtn).addClass('green-meadow');
            }
        }
    }
});

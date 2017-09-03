import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',

    actions: {
        inputNumber() {
            var inputField = $('.client-phone__input'),
                inputValue = $('#phone-number'),
                phoneValue = "",
                submitBtn = $('#phone-submit');


            if ($(inputValue).val().length<10) {
                phoneValue = $(inputValue).val() + this.value;
                $(inputValue).val(phoneValue);
                $(inputField).text(phoneValue);
            }

            if (phoneValue.length === 10) {
                $(submitBtn).removeAttr('disabled');
                $(submitBtn).addClass('green-meadow');
            }
        }
    }
});

import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',

    actions: {
        removeLastNumber() {
            var inputField = $('.ticket-info-client__input'),
                inputValue = $('#phone-number'),
                phoneValue = $(inputValue).val(),
                submitBtn = $('#phone-submit');


                phoneValue = phoneValue.slice(0,-1);
                $(inputValue).val(phoneValue);
                $(inputField).text(phoneValue);

                $(submitBtn).attr('disabled','true');
                $(submitBtn).removeClass('green-meadow');
        }
    }
});
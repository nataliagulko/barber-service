import Ember from 'ember';

export default Ember.Service.extend({

    showElement(elemSelector, step) {
        $('.mt-step-col').removeClass('active');
        $(step).addClass('active');

        $('.right-panel').addClass('hidden');
        $(elemSelector).removeClass('hidden');
    }
});

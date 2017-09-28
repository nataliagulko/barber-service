import Ember from 'ember';

export default Ember.Service.extend({

    showElement(elemSelector, step) {
        $('.mt-step-col').removeClass('active');
        $(step).addClass('active');

        $('.right-panel').addClass('hidden');
        $(elemSelector).removeClass('hidden');
    },

    selectMaster(masterName, imgSrc) {
        $('.ticket-info-master__name').text(masterName);
        $('.ticket-info-master__img').attr("src", imgSrc);
    }
});

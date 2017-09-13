import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',
    ticketService: Ember.inject.service('ticket-service'),

    actions: {
        showElement: function(elemSelector, stepSelector) {
            var ticketService = this.get('ticketService');
            ticketService.showElement(elemSelector,stepSelector);
        }
    }
});

import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['mt-element-step'],
    ticketService: Ember.inject.service('ticket-service'),

    actions: {
        showElement: function(elemSelector, stepSelector) {
            var ticketService = this.get('ticketService');
            ticketService.showElement(elemSelector,stepSelector);
        }
    }
});

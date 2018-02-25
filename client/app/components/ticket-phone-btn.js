import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',
    ticketService: Ember.inject.service('ticket-service'),

    actions: {
        inputPhone(value) {
            var ticketService = this.get('ticketService');
            ticketService.inputPhone(value);
        }
    }
});

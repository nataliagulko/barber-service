import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    ticketService: Ember.inject.service('ticket-service'),

    actions: {
        selectServiceItem(service){
            var ticketService = this.get('ticketService');
            ticketService.selectServiceItem(service);
        }
    }
});

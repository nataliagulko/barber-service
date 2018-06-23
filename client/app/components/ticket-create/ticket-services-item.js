import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    ticketService: Ember.inject.service('ticket-service'),

    actions: {
        toggleServiceItem(service, event){
            var ticketService = this.get('ticketService');
            ticketService.toggleServiceItem(service, event);
        }
    }
});

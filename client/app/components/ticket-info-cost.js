import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    ticketService: Ember.inject.service("ticket-service"),
    cost: Ember.computed.readOnly("ticketService.cost"),
    time: Ember.computed.readOnly("ticketService.time")
});

import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    ticketService: Ember.inject.service("ticket-service"),
    ticketDate: Ember.computed.readOnly("ticketService.ticketDate"),
    time: Ember.computed.readOnly("ticketService.time")
});

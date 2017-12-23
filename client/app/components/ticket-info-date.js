import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    ticketService: Ember.inject.service("ticket-service"),
    time: Ember.computed.readOnly("ticketService.time")
});

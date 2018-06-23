import Ember from 'ember';

export default Ember.Component.extend({
        tagName: '',
        ticketService: Ember.inject.service("ticket-service"),
        selectedServices: Ember.computed.readOnly("ticketService.selectedServices")
});

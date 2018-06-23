import Ember from 'ember';

export default Ember.Component.extend({
        tagName: '',
        ticketService: Ember.inject.service("ticket-service"),
        selectedMaster: Ember.computed.readOnly("ticketService.selectedMaster"),
});

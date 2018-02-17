import Ember from 'ember';

export default Ember.Component.extend({
    // classNames: ["hidden"],
    ticketService: Ember.inject.service("ticket-service"),
    selectedMaster: Ember.computed.readOnly("ticketService.selectedMaster"),
    ticketDate: Ember.computed.readOnly("ticketService.ticketDate"),
    time: Ember.computed.readOnly("ticketService.time"),    
    duration: Ember.computed.readOnly("ticketService.duration"),    
});

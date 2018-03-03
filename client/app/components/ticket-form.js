import Ember from 'ember';

export default Ember.Component.extend({
    // classNames: ["hidden"],
    ticketService: Ember.inject.service("ticket-service"),
    selectedMaster: Ember.computed.readOnly("ticketService.selectedMaster"),
    ticketDate: Ember.computed.readOnly("ticketService.ticketDate"),
    ticketTime: Ember.computed.readOnly("ticketService.ticketTime"),    
    duration: Ember.computed.readOnly("ticketService.duration"),    
    cost: Ember.computed.readOnly("ticketService.cost"), 
    client: Ember.computed.readOnly("ticketService.client"),     
});

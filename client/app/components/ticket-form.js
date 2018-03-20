import Ember from 'ember';

export default Ember.Component.extend({
    // classNames: ["hidden"],
    ticketService: Ember.inject.service("ticket-service"),
    selectedMaster: Ember.computed.readOnly("ticketService.selectedMaster"),
    selectedServices: Ember.computed.readOnly("ticketService.selectedServices"),
    ticketDate: Ember.computed.readOnly("ticketService.ticketDate"),
    ticketTime: Ember.computed.readOnly("ticketService.ticketTime"),    
    duration: Ember.computed.readOnly("ticketService.duration"),    
    cost: Ember.computed.readOnly("ticketService.cost"), 
    client: Ember.computed.readOnly("ticketService.client"),

    actions: {
        saveTicket: function () {
            let ticket = this.get("ticket");

            ticket.set("ticketDate", this.get("ticketDate"));
            ticket.set("time", this.get("ticketTime"));
            ticket.set("duration", this.get("duration"));
            ticket.set("cost", this.get("cost"));      
            
            ticket.set("client", this.get("client"));
            ticket.set("master", this.get("selectedMaster"));
            ticket.set("services", this.get("selectedServices"));

            ticket
                .save();

            return false;
        }
    }
});

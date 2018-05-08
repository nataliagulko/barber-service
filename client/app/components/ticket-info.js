import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['portlet', 'light', 'bordered'],
    ticketService: Ember.inject.service("ticket-service"),
    ticket: Ember.computed.readOnly("ticketService.ticket"),
    validationMessage: Ember.computed.readOnly("ticketService.validationMessage"),

    didInsertElement() {
        const ticketService = this.get("ticketService");
        ticketService.createTicketRecord();
    },

    actions: {
        saveTicket() {
            const ticketService = this.get("ticketService");
            ticketService.saveTicket();
        }
    }
});

import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['portlet', 'light', 'bordered'],
    ticketService: Ember.inject.service("ticket-service"),
    validationMessage: Ember.computed.readOnly("ticketService.validationMessage"),

    didInsertElement() {
        const ticketService = this.get("ticketService");
        ticketService.setTicketRecord(this.get("ticket"));
    },

    actions: {
        saveTicket() {
            const ticketService = this.get("ticketService");
            ticketService.saveTicket();
        }
    }
});

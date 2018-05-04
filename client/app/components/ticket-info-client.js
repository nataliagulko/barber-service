import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    ticketService: Ember.inject.service("ticket-service"),
    phone: Ember.computed.readOnly("ticketService.phone"),
    client: Ember.computed.readOnly("ticketService.client"),
    activeStep: Ember.computed.readOnly("ticketService.activeStep"),
    isNewClient: Ember.computed.readOnly("ticketService.isNewClient"),

    actions: {
        setClientName: function (name) {
            let ticketService = this.get("ticketService");
            ticketService.setClientName(name);
        }
    }
});

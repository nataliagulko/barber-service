import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    tagName: '',
    ticketService: inject("ticket-service"),
    phone: readOnly("ticketService.phone"),
    ticket: readOnly("ticketService.ticket"),
    activeStep: readOnly("ticketService.activeStep"),
    isNewClient: readOnly("ticketService.isNewClient"),

    actions: {
        saveClient: function (name) {
            let ticketService = this.ticketService;
            ticketService.saveClient(name);
        }
    }
});

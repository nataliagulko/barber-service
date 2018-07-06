import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    classNames: ['portlet', 'light', 'bordered'],
    ticketService: inject("ticket-service"),
    validationMessage: readOnly("ticketService.validationMessage"),

    actions: {
        saveTicket() {
            const ticketService = this.get("ticketService");
            ticketService.saveTicket();
        }
    }
});

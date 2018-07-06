import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    tagName:'',
    ticketService: inject('ticket-service'),

    actions: {
        inputPhone(value) {
            var ticketService = this.get('ticketService');
            ticketService.inputPhone(value);
        }
    }
});

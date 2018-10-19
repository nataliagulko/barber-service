import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    tagName: '',
    ticketService: inject('ticket-service'),

    actions: {
        toggleServiceItem(service, event){
            var ticketService = this.ticketService;
            ticketService.toggleServiceItem(service, event);
        }
    }
});

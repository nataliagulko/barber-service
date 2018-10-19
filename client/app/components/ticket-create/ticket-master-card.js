import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    tagName: '',
    ticketService: inject('ticket-service'),

    actions: {
        toggleMaster(master, event){
            var ticketService = this.ticketService;
            ticketService.toggleMaster(master, event);
        }
    }
});

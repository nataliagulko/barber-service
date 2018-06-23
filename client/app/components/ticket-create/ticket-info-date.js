import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    tagName: '',
    ticketService: inject("ticket-service"),
    ticketDate: readOnly("ticketService.ticketDate"),
    ticketTime: readOnly("ticketService.ticketTime")
});

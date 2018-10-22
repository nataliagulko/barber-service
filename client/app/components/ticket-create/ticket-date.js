import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	tagName: '',
	ticketService: inject("ticket-service"),
	ticket: readOnly("ticketService.ticket"),
	activeStep: readOnly("ticketService.activeStep"),
	hint: readOnly("ticketService.hint"),

	actions: {
		onTicketDateChange: function (selectedDate) {
			let ticketService = this.ticketService;
			ticketService.onTicketDateChange(selectedDate);
		}
	}
});

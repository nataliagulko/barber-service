import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	tagName: '',
	ticketService: inject("ticket-service"),
	activeStep: readOnly("ticketService.activeStep"),
	hint: readOnly("ticketService.hint"),

	actions: {
		onTicketTimeChange: function (selectedTime) {
			let ticketService = this.ticketService;
			ticketService.onTicketTimeChange(selectedTime);
		}
	}
});

import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	tagName: '',
	ticketService: inject("ticket-service"),
	activeStep: readOnly("ticketService.activeStep"),

	actions: {
		onTicketTimeChange: function (selectedTime) {
			let ticketService = this.get("ticketService");
			ticketService.onTicketTimeChange(selectedTime);
		}
	}
});

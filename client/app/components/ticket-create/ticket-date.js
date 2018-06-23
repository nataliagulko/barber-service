import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	tagName: '',
	ticketService: inject("ticket-service"),
	activeStep: readOnly("ticketService.activeStep"),

	actions: {
		onTicketDateChange: function (selectedDate) {
			let ticketService = this.get("ticketService");
			ticketService.onTicketDateChange(selectedDate);
		}
	}
});

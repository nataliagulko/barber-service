import Ember from 'ember';

export default Ember.Component.extend({
	// classNames: ['portlet', 'light', 'bordered', 'right-panel'],
	// elementId: 'ticket-time',
	tagName: '',
	ticketService: Ember.inject.service("ticket-service"),
	activeStep: Ember.computed.readOnly("ticketService.activeStep"),

	actions: {
		onTicketTimeChange: function (selectedTime) {
			let ticketService = this.get("ticketService");
			ticketService.onTicketTimeChange(selectedTime);
		}
	}
})

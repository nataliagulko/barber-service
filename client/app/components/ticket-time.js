import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['portlet', 'light', 'bordered', 'right-panel'],
	elementId: 'ticket-time',
	ticketService: Ember.inject.service("ticket-service"),

	actions: {
		onTicketTimeChange: function (selectedTime) {
			let ticketService = this.get("ticketService");
			ticketService.onTicketTimeChange(selectedTime);
		}
	}
})

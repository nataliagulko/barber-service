import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['portlet', 'light', 'bordered', 'right-panel'],
	elementId: 'ticket-date',
	ticketService: Ember.inject.service("ticket-service"),

	actions: {
		onTicketDateChange: function (selectedDate) {
			let ticketService = this.get("ticketService");
			ticketService.onTicketDateChange(selectedDate);
		}
	}
});

import Ember from 'ember';

export default Ember.Component.extend({
	// classNames: ['portlet', 'light', 'bordered', 'right-panel'],
	// elementId: 'ticket-date',
	tagName: '',
	ticketService: Ember.inject.service("ticket-service"),
	activeStep: Ember.computed.readOnly("ticketService.activeStep"),

	actions: {
		onTicketDateChange: function (selectedDate) {
			let ticketService = this.get("ticketService");
			ticketService.onTicketDateChange(selectedDate);
		}
	}
});

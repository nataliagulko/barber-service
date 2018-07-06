import Component from '@ember/component';
import moment from 'moment';
import $ from 'jquery';
import { inject } from '@ember/service';

export default Component.extend({
	tagName: "button",
	classNames: ["btn"],
	store: inject("store"),
	bootbox: inject("bootbox-service"),
	notification: inject("notification-service"),

	click() {
		const act = this.get("act");
		const event = this.get("event");

		this.send(act, event);
	},

	updateTicketStatus: function (event, status) {
		const store = this.get("store");
		const notification = this.get("notification");

		store.findRecord("ticket", event.id)
			.then((ticket) => {
				ticket.set("status", status);
				ticket
					.save()
					.then((ticket) => {
						const ticketDate = moment(ticket.get("ticketDate")).format("Do MMMM");
						const updatedStatus = ticket.get("status");
						const message = `Запись ${ticketDate} ${ticket.get("time")} имеет статус ${updatedStatus}`;

						this.set("modal", false);
						notification.showInfoMessage(message);
						this._updateEvent(event, updatedStatus);
					});
			});
	},

	_updateEvent: function (event, status) {
		status = status.toLowerCase();
		event.status = status;
		event.className = ["ticket-calendar__event", `ticket-calendar__event_${status}`];
		$(".full-calendar").fullCalendar("updateEvent", event);
	},

	actions: {
		remove: function (event) {
			const store = this.get("store");

			this.set("modal", false);
			this.get("bootbox").confirmDelete(store, "ticket", event.id);
		},

		reject: function (event) {
			this.updateTicketStatus(event, "REJECTED");
		},

		accept: function (event) {
			this.updateTicketStatus(event, "ACCEPTED");
		}
	}
});

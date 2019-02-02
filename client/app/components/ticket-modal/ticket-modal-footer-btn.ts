import { classNames, tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import $ from "jquery";
import moment from "moment";

@tagName("button")
@classNames("btn")
export default class TicketModalFooterBtn extends Component {
	act!: string
	event: any
	modal!: boolean

	store = service("store")
	bootbox = service("bootbox-service")
	notification = service("notification-service")

	click() {
		const act = this.act;
		const event = this.event;

		this.send(act, event);
	}

	updateTicketStatus(this: TicketModalFooterBtn, event: any, status: string) {
		const ticketModalFooterBtn = this
		const store = get(ticketModalFooterBtn, "store")
		const notification = get(ticketModalFooterBtn, "notification")

		store.findRecord("ticket", event.id)
			.then((ticket: any) => {
				set(ticket, "status", status);
				ticket
					.save()
					.then(() => {
						const ticketDate = moment(get(ticket, "ticketDate")).format("Do MMMM");
						const updatedStatus = get(ticket, "status");
						const message = `Запись ${ticketDate} ${get(ticket, "time")} имеет статус ${updatedStatus}`;

						set(ticketModalFooterBtn, "modal", false);
						notification.info(message);
						ticketModalFooterBtn.updateEvent(event, updatedStatus);
					});
			});
	}

	updateEvent(event: any, status: string) {
		status = status.toLowerCase();
		event.status = status;
		event.className = ["ticket-calendar__event", `ticket-calendar__event_${status}`];
		$(".full-calendar").fullCalendar("updateEvent", event);
	}

	actions = {
		remove(this: TicketModalFooterBtn, event: any) {
			const ticketModalFooterBtn = this
			const store = get(ticketModalFooterBtn, "store");

			set(ticketModalFooterBtn, "modal", false);
			get(ticketModalFooterBtn, "bootbox").confirmDelete(store, "ticket", event.id);
		},

		reject(this: TicketModalFooterBtn, event: any) {
			this.updateTicketStatus(event, "REJECTED");
		},

		accept(this: TicketModalFooterBtn, event: any) {
			this.updateTicketStatus(event, "ACCEPTED");
		},
	}
}

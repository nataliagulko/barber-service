import { classNames } from "@ember-decorators/component";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@classNames("mt-element-step")
export default class TicketSteps extends Component {
	ticketService = service("ticket-service")

	actions = {
		getMasters(this: TicketSteps) {
			get(this, "ticketService").changeStep("", "#master-step");
		},

		getServicesByMaster(this: TicketSteps) {
			const ticketService = get(this, "ticketService");
			ticketService.getServicesByMaster();
			ticketService.changeStep("#master-step", "#services-step");
		},

		getHolidays(this: TicketSteps) {
			const ticketService = get(this, "ticketService");
			ticketService.getHolidays();
			ticketService.changeStep("#services-step", "#date-step");
		},

		getTimeSlots(this: TicketSteps) {
			const ticketService = get(this, "ticketService");
			ticketService.getTimeSlots();
			ticketService.changeStep("#date-step", "#time-step");
		},

		getClient(this: TicketSteps) {
			const ticketService = get(this, "ticketService");
			ticketService.changeStep("#time-step", "#client-step");
		},
	}
}

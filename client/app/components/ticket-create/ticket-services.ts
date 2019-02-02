import { tagName } from "@ember-decorators/component";
import { not, reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketServices extends Component {
	filter!: string
	filteredServices!: any[]

	ticketService = service("ticket-service")

	@reads("ticketService.ticket")
	ticket: any

	@reads("ticketService.servicesByMaster")
	servicesByMaster!: any[]

	@reads("ticketService.activeStep")
	activeStep!: string

	@reads("ticketService.hint")
	hint!: string

	@not("ticketService.ticket.duration")
	servicesNotSelected!: boolean

	actions = {
		getHolidays(this: TicketServices) {
			const ticketService = get(this, "ticketService")
			ticketService.getHolidays();
			ticketService.changeStep("#services-step", "#date-step");
		},

		filterServices(this: TicketServices) {
			const filter = get(this, "filter")
			const servicesByMaster = get(this, "servicesByMaster")

			if (filter && filter.length > 2) {
				const fs = servicesByMaster.filter((item) => {
					const i = item.get("name").toLowerCase();
					const f = filter.toLowerCase();
					return i.indexOf(f) !== -1;
				});

				this.set("filteredServices", fs);
			} else {
				this.set("filteredServices", null);
			}
		},
	}
}

import { tagName } from "@ember-decorators/component";
import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketTime extends Component {
	ticketService = service("ticket-service")

	@reads("ticketService.ticket")
	ticket: any

	@reads("ticketService.activeStep")
	activeStep!: string

	@reads("ticketService.hint")
	hint!: string

	actions = {
		onTicketTimeChange(this: TicketTime, selectedTime: string) {
			get(this, "ticketService").onTicketTimeChange(selectedTime);
		},
	}
}

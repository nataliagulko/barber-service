import { tagName } from "@ember-decorators/component";
import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketDate extends Component {
	ticketService = service("ticket-service")

	@reads("ticketService.ticket")
	ticket: any

	@reads("ticketService.activeStep")
	activeStep!: string

	@reads("ticketService.hint")
	hint!: string

	actions = {
		onTicketDateChange(this: TicketDate, selectedDate: any) {
			get(this, "ticketService").onTicketDateChange(selectedDate)
		},
	}
}

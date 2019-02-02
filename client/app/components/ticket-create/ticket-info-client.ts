import { tagName } from "@ember-decorators/component";
import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketInfoClient extends Component {
	ticketService = service("ticket-service")

	@reads("ticketService.phone")
	phone!: string

	@reads("ticketService.ticket")
	ticket: any

	@reads("ticketService.activeStep")
	activeStep!: string

	@reads("ticketService.isNewClient")
	isNewClient!: boolean

	actions = {
		saveClient(this: TicketInfoClient, name: string) {
			get(this, "ticketService").saveClient(name);
		},
	}
}

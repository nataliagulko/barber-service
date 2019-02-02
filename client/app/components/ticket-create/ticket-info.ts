import { classNames } from "@ember-decorators/component";
import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@classNames("portlet", "light", "bordered", "ticket-portlet")
export default class TicketInfo extends Component {
	ticketService = service("ticket-service")

	@reads("ticketService.validationMessage")
	validationMessage!: string

	actions = {
		saveTicket(this: TicketInfo) {
			get(this, "ticketService").saveTicket();
		},
	}
}

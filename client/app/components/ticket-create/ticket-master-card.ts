import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketMasterCard extends Component {
	ticketService = service("ticket-service")

	actions = {
		toggleMaster(this: TicketMasterCard, master: any, event: MouseEvent) {
			get(this, "ticketService").toggleMaster(master, event)
		},
	}
}

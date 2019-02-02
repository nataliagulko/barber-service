import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketPhoneRemoveBtn extends Component {
	ticketService = service("ticket-service")

	actions = {
		removeLastNumber(this: TicketPhoneRemoveBtn) {
			get(this, "ticketService").removeLastNumber();
		},
	}
}

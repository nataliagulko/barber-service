import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketPhoneBtn extends Component {
	ticketService = service("ticket-service")

	actions = {
		inputPhone(this: TicketPhoneBtn, value: string) {
			get(this, "ticketService").inputPhone(value);
		},
	}
}

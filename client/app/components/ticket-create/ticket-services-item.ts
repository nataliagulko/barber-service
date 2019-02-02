import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketSerivcesItem extends Component {
	ticketService = service("ticket-service")

	actions = {
		toggleServiceItem(this: TicketSerivcesItem, serviceItem: any, event: MouseEvent) {
			get(this, "ticketService").toggleServiceItem(serviceItem, event);
		},
	}
}

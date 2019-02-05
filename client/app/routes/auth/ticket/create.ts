import { alias } from "@ember-decorators/object/computed";
import { get, set } from "@ember/object";
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import RollbackAttributesMixin from "nova/mixins/rollback-attributes-mixin";
import Ticket from "nova/models/ticket";
import { hash } from "rsvp";

export default class AuthTicketCreateRoute extends Route.extend(RollbackAttributesMixin) {
	ticketService = service("ticket-service")

	@alias("ticketService.ticket")
	ticket!: Ticket

	model(this: AuthTicketCreateRoute) {
		const store = get(this, "store")
		const ticket = store.createRecord("ticket");
		set(this, "ticket", ticket);

		return hash({
			masters: store.findAll("master"),
		});
	}

	deactivate(this: AuthTicketCreateRoute) {
		this._super(...arguments);

		const ticketService = get(this, "ticketService")

		this.rollback(this.ticket);
		ticketService.changeStep("", "#master-step");
	}
}

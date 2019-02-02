import { tagName } from "@ember-decorators/component";
import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { inject as service } from "@ember/service";

@tagName("")
export default class TicketClient extends Component {
	ticketService = service("ticket-service")

	@reads("ticketService.activeStep")
	activeStep!: string
}

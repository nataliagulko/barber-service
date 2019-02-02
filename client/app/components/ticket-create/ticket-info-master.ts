import { tagName } from "@ember-decorators/component";
import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { inject as service } from "@ember/service";

@tagName("")
export default class TikcetInfoMaster extends Component {
	ticketService = service("ticket-service")

	@reads("ticketService.ticket")
	ticket: any
}

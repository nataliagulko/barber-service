import Route from "@ember/routing/route";
import { hash } from "rsvp";

export default class AuthTicketIndex extends Route {
	model() {
		return hash({
			allEvents: [],
		});
	}
}

import { classNames } from "@ember-decorators/component";
import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import $ from "jquery";
import moment from "moment";

@classNames("calendar")
export default class TicketCalendar extends Component {
	selectedEvent!: object
	openTicketInfo!: boolean
	allEvents!: any[]

	store = service("store")

	headerOptions = {
		center: "",
		left: "title",
		right: "prev,next,today,agendaDay,agendaWeek,month",
	}

	views = {
		agendaDay: {
		},
		agendaWeek: {
			groupByDateAndResource: true,
		},
		month: {
			eventLimit: 5,
			groupByDateAndResource: true,
		},
	}

	actions = {
		getEvents(this: TicketCalendar, start: string, end: string, timezone: string, callback: void) {
			const ticketCalendar = this;

			const events: any[] = []
			const ticketList = ticketCalendar.getTicketList(start, end);

			ticketList.then((tickets: any) => {
				tickets.forEach((ticket: any) => {
					ticketCalendar.renderEvents(ticket, events, callback);
				});
			});
		},

		getResources(this: TicketCalendar, callback: void, start: string, end: string) {
			const ticketCalendar = this;

			const resources: any[] = []
			const ticketList = ticketCalendar.getTicketList(start, end);

			ticketList.then((tickets: any) => {
				tickets.forEach((ticket: any) => {
					ticketCalendar.renderResources(ticket, resources, callback);
				});
			});
		},

		showTicketInfo(this: TicketCalendar, event: MouseEvent) {
			set(this, "selectedEvent", event);
			set(this, "openTicketInfo", true);
		},
	}

	getTicketList(this: TicketCalendar, start: string, end: string) {
		const dateFormat = "DD.MM.YYYY";

		const ticketList = get(this, "store").query("ticket", {
			onlyHead: true,
			ticketDateFrom: start.format(dateFormat),
			ticketDateTo: end.format(dateFormat),
		});

		return ticketList;
	}

	getClientNameOrPhone(this: TicketCalendar, clientId: number) {
		const client = get(this, "store").findRecord("client", clientId);
		client.then((c: any) => {
			return c.get("fullname") !== "null null" ? c.get("fullname") : c.get("phone");
		});
	}

	renderEvents(this: TicketCalendar, ticket: any, events: any[], callback: void) {
		const $calendar = $(".full-calendar")
		const ticketDuration = ticket.get("duration")
		const ticketDate = ticket.get("ticketDate")
		const ticketStrartDate = moment(ticketDate)
		const ticketEndDate = moment(ticketDate).add(ticketDuration, "minutes")
		const ticketStatus = ticket.get("status").toLowerCase()
		const masterId = ticket.belongsTo("master").id()
		const client = ticket.get("client")

		client.then((c: any) => {
			const ticketTitle = c.get("fullname") !== "null null" ? c.get("fullname") : c.get("phone");

			const event = {
				className: ["ticket-calendar__event", `ticket-calendar__event_${ticketStatus}`],
				data: ticket,
				end: ticketEndDate,
				id: ticket.get("id"),
				resourceId: masterId,
				start: ticketStrartDate,
				status: ticketStatus,
				title: ticketTitle,
			};

			callback(events);
			$calendar.fullCalendar("renderEvent", event);
			events.pushObject(event);
			set(this, "allEvents", events);
		});
	}

	renderResources(this: TicketCalendar, ticket: any, resources: any[], callback: void) {
		const masterId = ticket.belongsTo("master").id();
		let resource = null;

		ticket.get("master").then((master: any) => {
			resource = {
				id: masterId,
				title: master.get("fullname"),
			};

			if (!resources.isAny("id", masterId)) {
				resources.pushObject(resource);
			}

			callback(resources);
		});
	}
}

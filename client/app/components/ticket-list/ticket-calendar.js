import Component from '@ember/component';
import moment from 'moment';
import $ from 'jquery';
import { inject } from '@ember/service';

export default Component.extend({
	classNames: ["calendar"],
	store: inject("store"),

	headerOptions: {
		left: "title",
		center: "",
		right: "prev,next,today,agendaDay,agendaWeek,month"
	},
	views: {
		agendaDay: {
		},
		agendaWeek: {
			groupByDateAndResource: true,
		},
		month: {
			groupByDateAndResource: true,
			eventLimit: 5
		}
	},
	selectedEvent: {},

	actions: {
		getEvents: function (start, end, timezone, callback) {
			const _this = this;

			let events = [],
				ticketList = _this.getTicketList(start, end);

			ticketList.then((tickets) => {
				tickets.forEach(ticket => {
					_this.renderEvents(_this, ticket, events, callback);
				});
			});
		},

		getResources: function (callback, start, end) {
			const _this = this;

			let resources = [],
				ticketList = _this.getTicketList(start, end);

			ticketList.then((tickets) => {
				tickets.forEach(ticket => {
					_this.renderResources(_this, ticket, resources, callback);
				});
			});
		},

		showTicketInfo: function (event) {
			this.set("selectedEvent", event);
			this.set("openTicketInfo", true);
		}
	},

	getTicketList: function (start, end) {
		const dateFormat = 'DD.MM.YYYY';

		const ticketList = this.store.query('ticket', {
			onlyHead: true,
			ticketDateFrom: start.format(dateFormat),
			ticketDateTo: end.format(dateFormat),
		});

		return ticketList;
	},

	getClientNameOrPhone: function (clientId) {
		let client = this.store.findRecord("client", clientId);
		client.then((c) => {
			return c.get("fullname") !== "null null" ? c.get("fullname") : c.get("phone");
		});
	},

	renderEvents: function (_this, ticket, events, callback) {
		const $calendar = $(".full-calendar"),
			ticketDuration = ticket.get("duration"),
			ticketDate = ticket.get("ticketDate"),
			ticketStrartDate = moment(ticketDate),
			ticketEndDate = moment(ticketDate).add(ticketDuration, 'minutes'),
			ticketStatus = ticket.get("status").toLowerCase(),
			masterId = ticket.belongsTo("master").id(),
			client = ticket.get("client");

		client.then((c) => {
			let ticketTitle = c.get("fullname") !== "null null" ? c.get("fullname") : c.get("phone");

			let event = {
				id: ticket.get("id"),
				resourceId: masterId,
				title: ticketTitle,
				start: ticketStrartDate,
				end: ticketEndDate,
				status: ticketStatus,
				className: ["ticket-calendar__event", `ticket-calendar__event_${ticketStatus}`],
				data: ticket
			};

			callback(events);
			$calendar.fullCalendar("renderEvent", event);
			events.pushObject(event);
			this.set("allEvents", events);
		});
	},

	renderResources: function (_this, ticket, resources, callback) {
		const masterId = ticket.belongsTo("master").id();

		let resource = null;

		ticket.get("master").then((master) => {
			resource = {
				id: masterId,
				title: master.get("fullname")
			};

			if (!resources.isAny("id", masterId)) {
				resources.pushObject(resource);
			}

			callback(resources);
		});
	}
});

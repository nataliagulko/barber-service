import Component from "@ember/component";
import { get } from "@ember/object";
import $ from "jquery";

export default class CalendarFilters extends Component {
	allEvents!: any[]

	ticketStatuses = [
		{
			alias: "new",
			bgClasses: ["bg-blue-sharp", "bg-font-blue-sharp"],
			btnClass: "blue-sharp",
			fontClass: "font-blue-sharp",
			text: "Новые",
		},
		{
			alias: "accepted",
			bgClasses: ["bg-green-turquoise", "bg-font-green-turquoise"],
			btnClass: "green-turquoise",
			fontClass: "font-green-turquoise",
			text: "Подтвержденные",
		},
		{
			alias: "rejected",
			bgClasses: ["bg-red-pink", "bg-font-red-pink"],
			btnClass: "red-pink",
			fontClass: "font-red-pink",
			text: "Отклоненные",
		},
		{
			alias: "canceled",
			bgClasses: ["bg-yellow-lemon", "bg-font-yellow-lemon"],
			btnClass: "yellow-lemon",
			fontClass: "font-yellow-lemon",
			text: "Отмененные",
		},
		{
			alias: "completed",
			bgClasses: ["bg-default", "bg-font-default"],
			btnClass: "btn-default",
			fontClass: "font-default",
			text: "Завершенные",
		},
	]

	actions = {
		filterEventsByStatus(this: CalendarFilters, status: string) {
			const $calendar = $(".full-calendar")
			const allEvents = get(this, "allEvents")

			let renderedEvents = [];

			if (status === "all") {
				renderedEvents = allEvents;
			} else {
				renderedEvents = allEvents.filterBy("status", status);
			}

			$calendar.fullCalendar("removeEvents");
			$calendar.fullCalendar("renderEvents", renderedEvents);
		},
	}
}

import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
    ticketStatuses: [
        {
            alias: "new",
            text: "Новые",
            fontClass: "font-blue-sharp",
            bgClasses: ["bg-blue-sharp", "bg-font-blue-sharp"],
            btnClass: "blue-sharp"
        },
        {
            alias: "accepted",
            text: "Подтвержденные",
            fontClass: "font-green-turquoise",
            bgClasses: ["bg-green-turquoise", "bg-font-green-turquoise"],
            btnClass: "green-turquoise"
        },
        {
            alias: "rejected",
            text: "Отклоненные",
            fontClass: "font-red-pink",
            bgClasses: ["bg-red-pink", "bg-font-red-pink"],
            btnClass: "red-pink"
        },
        {
            alias: "canceled",
            text: "Отмененные",
            fontClass: "font-yellow-lemon",
            bgClasses: ["bg-yellow-lemon", "bg-font-yellow-lemon"],
            btnClass: "yellow-lemon"
        },
        {
            alias: "completed",
            text: "Завершенные",
            fontClass: "font-default",
            bgClasses: ["bg-default", "bg-font-default"],
            btnClass: "btn-default"
        }
    ],

    actions: {
        filterEventsByStatus: function (status, ev) {
            const $calendar = $(".full-calendar"),
                allEvents = this.allEvents;

			let renderedEvents = [];
			
            if (status === "all") {
                renderedEvents = allEvents;
            } else {
                renderedEvents = allEvents.filterBy("status", status);
            }

            $calendar.fullCalendar('removeEvents');
            $calendar.fullCalendar('renderEvents', renderedEvents);
        }
    }
});

import Ember from 'ember';

export default Ember.Component.extend({
    ticketStatuses: [
        {
            alias: "new",
            text: "Новые",
            fontClass: "font-blue-sharp",
            bgClasses: ["bg-blue-sharp", "bg-font-blue-sharp"]
        },
        {
            alias: "accepted",
            text: "Подтвержденные",
            fontClass: "font-green-turquoise",
            bgClasses: ["bg-green-turquoise", "bg-font-green-turquoise"]
        },
        {
            alias: "rejected",
            text: "Отклоненные",
            fontClass: "font-red-pink",
            bgClasses: ["bg-red-pink", "bg-font-red-pink"]
        },
        {
            alias: "canceled",
            text: "Отмененные",
            fontClass: "font-yellow-lemon",
            bgClasses: ["bg-yellow-lemon", "bg-font-yellow-lemon"]
        },
        {
            alias: "completed",
            text: "Завершенные",
            fontClass: "font-default",
            bgClasses: ["bg-default", "bg-font-default"]
        }
    ],

    actions: {
        filterEventsByStatus: function (status) {
            const $calendar = Ember.$(".full-calendar"),
                allEvents = this.get("allEvents");

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

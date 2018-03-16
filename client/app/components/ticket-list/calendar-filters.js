import Ember from 'ember';

export default Ember.Component.extend({
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

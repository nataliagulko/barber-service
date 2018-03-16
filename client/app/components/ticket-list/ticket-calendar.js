import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["calendar"],
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
        showTicketInfo: function (event) {
            this.set("selectedEvent", event)
            this.$("#ticket-info").modal('show');
        }
    }
});

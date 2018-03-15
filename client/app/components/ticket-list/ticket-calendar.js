import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["calendar"],
    header: {
        left: 'prev,next,today',
        center: "title",
        right: "agendaDay,agendaWeek,month"
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

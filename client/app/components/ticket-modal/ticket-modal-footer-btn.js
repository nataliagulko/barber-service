import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    tagName: "button",
    classNames: ["btn"],
    store: Ember.inject.service("store"),
    bootbox: Ember.inject.service("bootbox-service"),
    notification: Ember.inject.service("notification-service"),

    click() {
        const act = this.get("act"),
            event = this.get("event");

        this.send(act, event);
    },

    updateTicketStatus: function (event, status) {
        const store = this.get("store"),
            notification = this.get("notification");

        store.findRecord("ticket", event.id)
            .then((ticket) => {
                ticket.set("status", status);
                ticket
                    .save()
                    .then((ticket) => {
                        const ticketDate = moment(ticket.get("ticketDate")).format("Do MMMM"),
                            updatedStatus = ticket.get("status"),
                            message = `Запись ${ticketDate} ${ticket.get("time")} имеет статус ${updatedStatus}`;

                        Ember.$("#ticket-modal").modal('hide');
                        notification.showInfoMessage(message);
                        this._updateEvent(event, updatedStatus);
                    });
            });
    },

    _updateEvent: function (event, status) {
        status = status.toLowerCase();
        event.status = status;
        event.className = ["ticket-calendar__event", `ticket-calendar__event_${status}`];
        Ember.$(".full-calendar").fullCalendar("updateEvent", event);
        console.log(event);
    },

    actions: {
        remove: function (event) {
            const store = this.get("store");

            Ember.$("#ticket-modal").modal('hide');
            this.get("bootbox").confirmDelete(store, "ticket", event.id, "запись");

            // this.updateTicketStatus(event, "DELETED");            
        },

        reject: function (event) {
            this.updateTicketStatus(event, "REJECTED");
        },

        accept: function (event) {
            this.updateTicketStatus(event, "ACCEPTED");
        }
    }
});

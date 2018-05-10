import Ember from 'ember';

export default Ember.Component.extend({
    tagName: "button",
    classNames: ["btn"],
    store: Ember.inject.service("store"),
    bootbox: Ember.inject.service("bootbox-service"),

    click() {
        const act = this.get("act"),
            event = this.get("event");

        this.send(act, event);
    },

    updateTicketStatus: function(event, status) {
        const store = this.get("store");

        store.findRecord("ticket", event.id)
            .then((ticket) => {
                ticket.set("status", status);
                ticket
                    .save()
                    .then((ticket) => {
                        console.log(ticket.get("status"));
                    });
            });
    },

    actions: {
        remove: function (event) {
            const store = this.get("store");

            Ember.$("#ticket-modal").modal('hide');
            this.get("bootbox").confirmDelete(store, "ticket", event.id, "запись");
        },

        reject: function (event) {
            this.updateTicketStatus(event, "REJECTED");
        },

        accept: function (event) {
            this.updateTicketStatus(event, "ACCEPTED");
        }
    }
});

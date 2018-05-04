import Ember from 'ember';

export default Ember.Component.extend({
    // classNames: ["hidden"],
    store: Ember.inject.service("store"),
    ticketService: Ember.inject.service("ticket-service"),
    selectedMaster: Ember.computed.readOnly("ticketService.selectedMaster"),
    selectedServices: Ember.computed.readOnly("ticketService.selectedServices"),
    ticketDate: Ember.computed.readOnly("ticketService.ticketDate"),
    ticketTime: Ember.computed.readOnly("ticketService.ticketTime"),
    duration: Ember.computed.readOnly("ticketService.duration"),
    cost: Ember.computed.readOnly("ticketService.cost"),
    client: Ember.computed.readOnly("ticketService.client"),
    clientName: Ember.computed.readOnly("ticketService.clientName"),
    phone: Ember.computed.readOnly("ticketService.phone"),

    actions: {
        saveTicket: function () {
            const store = this.get("store"),
                _this = this;

            let ticket = this.get("ticket"),
                client = this.get("client");

            ticket.set("ticketDate", this.get("ticketDate"));
            ticket.set("time", this.get("ticketTime"));
            ticket.set("duration", this.get("duration"));
            ticket.set("cost", this.get("cost"));

            ticket.set("master", this.get("selectedMaster"));
            ticket.set("services", this.get("selectedServices"));

            if (client) {
                ticket.set("client", client);
                this.save(ticket);
            } else {
                client = store.createRecord("client", {
                    firstname: this.get("clientName"),
                    phone: this.get("phone"),
                    password: "emptyPass123",
                    rpassword: "emptyPass123"
                });

                client
                    .save()
                    .then((cl) => {
                        ticket.set("client", cl);
                        _this.save(ticket);
                    });
            }

            return false;
        }
    },

    save(ticket) {
        const _this = this;

        ticket
            .save()
            .then(() => {
                _this.get("router").transitionTo('ticket');
            });
    }
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    datePeriod: {},

    beforeModel() {
        this._super(...arguments);

        const now = moment(),
            week = moment().add(1, 'week');

        let period = {
            from: now,
            to: week
        };

        this.set("datePeriod", period);
    },

    model() {
        const datePeriod = this.get("datePeriod"),
            dateFormat = 'DD.MM.YYYY';

        return Ember.RSVP.hash({
            tickets: this.get('store').query('ticket', {
                query: {
                    onlyHead: true,
                    ticketDateFrom: datePeriod.from.format(dateFormat),
                    ticketDateTo: datePeriod.to.format(dateFormat),
                    // include: "master, client, service"
                }
            }),
            events: []
        });
    },

    afterModel(model) {
        this._super(...arguments);

        let events = model.events,
            tickets = model.tickets;

        tickets.forEach(t => {
            const ticketId = t.get("id"),
                ticketDuration = t.get("duration"),
                ticketDate = t.get("ticketDate"),
                ticketStrartDate = moment(ticketDate),
                ticketEndDate = moment(ticketDate).add(ticketDuration, 'minutes'),
                ticketStatus = t.get("status").toLowerCase();
            let ticketTitle = null;

            t.get("client").then((client) => {
                ticketTitle = `${client.get("firstname")} ${client.get("secondname")}` || client.get("phone");

                events.pushObject({
                    id: ticketId,
                    title: ticketTitle,
                    start: ticketStrartDate,
                    end: ticketEndDate,
                    className: ["ticket-calendar__event", `ticket-calendar__event_${ticketStatus}`],
                    data: t
                });
            });
        });
    }
});

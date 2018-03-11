import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            tickets: this.get('store').query('ticket', {
                query: {
                    onlyHead: true,
                    ticketDateFrom: "11.03.2018",
                    ticketDateTo: "18.03.2018"
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
                ticketStrartDate = moment(t.get("ticketDate")),
                ticketEndDate = moment(t.get("ticketDate")).add(ticketDuration, 'minutes');

            events.pushObject({
                id: ticketId,
                title: "Title for " + ticketId,
                start: ticketStrartDate,
                end: ticketEndDate,
                className: ["event"],
                data: t
            });
        });
    }
});

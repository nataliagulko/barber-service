import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    classNames: ["calendar"],
    events: [],

    didInsertElement() {
        let tickets = this.get("tickets"),
            events = this.get("events");

        tickets.forEach(t => {
            const ticketId = t.get("id"),
                ticketStrartDate = moment(t.get("ticketDate")),
                ticketDuration = t.get("duration"),
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
    },

    getClientInfo(client) {
        const firstname = client.get("firstname"),
            secondname = client.get("secondname"),
            phone = client.get("phone");

        let title = "";

        if (firstname && secondname) {
            title = firstname + " " + secondname;
        } else {
            title = phone;
        }

        return title;
    }
});

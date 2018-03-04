import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    classNames: ["calendar"],
    events: [],

    didInsertElement() {
        let events = this.get("events"),
            tickets = this.get("tickets");

            tickets.forEach(t => {

                events.pushObject({
                    id: t.id,
                    title: t.id,
                    start: moment(t.ticketDate),
                    end: moment(t.ticketDate).add(t.duration, 'minutes'),
                    className: ["event"],
                    data: t
                });
            });

        console.log("events: ", this.get("events"));
            
    }
});

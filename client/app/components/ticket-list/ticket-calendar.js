import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    classNames: ["calendar"],
    store: Ember.inject.service("store"),

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
        getEvents: function (start, end, timezone, callback) {
            const dateFormat = 'DD.MM.YYYY',
                _this = this;

            const ticketList = this.get('store').query('ticket', {
                query: {
                    onlyHead: true,
                    ticketDateFrom: start.format(dateFormat),
                    ticketDateTo: end.format(dateFormat),
                }
            });

            let events = [];

            ticketList.then((tickets) => {
                tickets.forEach(ticket => {
                    _this.renderEvents(_this, ticket, events, callback);
                });
            });
        },

        showTicketInfo: function (event) {
            this.set("selectedEvent", event);
            this.$("#ticket-info").modal('show');
        }
    },

    getClientNameOrPhone: function (client) {
        return client.get("fullname") !== "null null" ? client.get("fullname") : client.get("phone")
    },

    renderEvents: function (_this, t, events, callback) {
        const $calendar = Ember.$(".full-calendar"),
            ticketId = t.get("id"),
            ticketDuration = t.get("duration"),
            ticketDate = t.get("ticketDate"),
            ticketStrartDate = moment(ticketDate),
            ticketEndDate = moment(ticketDate).add(ticketDuration, 'minutes'),
            ticketStatus = t.get("status").toLowerCase(),
            masterId = t.belongsTo("master").id();

        let ticketTitle = null,
            event = null;

        // t.get("master").then((master) => {
        //     if (!resources.isAny("id", masterId)) {
        //         resources.pushObject({
        //             id: masterId,
        //             title: `master.get("fullname")`
        //         });
        //     }
        // });

        t.get("client").then((client) => {
            ticketTitle = _this.getClientNameOrPhone(client);
            event = {
                id: ticketId,
                resourceId: masterId,
                title: ticketTitle,
                start: ticketStrartDate,
                end: ticketEndDate,
                status: ticketStatus,
                className: ["ticket-calendar__event", `ticket-calendar__event_${ticketStatus}`],
                data: t
            };

            $calendar.fullCalendar("renderEvent", event);
            events.pushObject(event);
            callback(events);
        });
    }
});

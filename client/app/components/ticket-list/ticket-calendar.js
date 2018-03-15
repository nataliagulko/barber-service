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
            groupByDateAndResource: true
        },
        agendaWeek: {
            groupByDateAndResource: true
        },
    },

    actions: {
        clicked: function (event) {
            console.log(event.title);
        }
    }
});

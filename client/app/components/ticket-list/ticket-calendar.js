import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    classNames: ["calendar"],
    header: {
        left: 'prev,next,today',
        center: "title",
        right: "agendaDay,agendaTwoDay,agendaWeek,month"
    },

    actions: {
        clicked: function (event) {
            console.log(event.id);
        }
    }
});

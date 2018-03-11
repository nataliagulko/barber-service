import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    classNames: ["calendar"],

    actions: {
        clicked: function (event) {
            console.log(event.id);
        }
    }
});

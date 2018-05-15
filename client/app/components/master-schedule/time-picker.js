import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['master-schedule__time'],

    actions: {
        onTimeChange: function (time) {
            console.log(time);
        }
    }
});

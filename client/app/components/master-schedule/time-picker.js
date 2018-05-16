import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['master-schedule__time', 'col-md-6', 'hidden'],

    actions: {
        onTimeChange: function (time) {
            console.log(time);
        }
    }
});

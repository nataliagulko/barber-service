import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["progress"],

    actions: {
        selectWorkTime: function(id) {
            console.log(id);
        }
    }
});

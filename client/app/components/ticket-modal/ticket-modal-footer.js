import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        remove: () => {
            console.log("footer, remove");
        }
    }
});

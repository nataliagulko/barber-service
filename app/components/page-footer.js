import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['page-footer'],

    didInsertElement: function() {
        Layout.init();
    }
});

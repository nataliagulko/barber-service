import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["master-schedule"],
    store: Ember.inject.service("store"),
    selectedDayOfWeek: null,
});


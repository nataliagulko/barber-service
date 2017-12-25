import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['portlet', 'light', 'bordered', 'right-panel'],
	elementId: 'ticket-date',
	pickadateService: Ember.inject.service("pickadate-service"),
});

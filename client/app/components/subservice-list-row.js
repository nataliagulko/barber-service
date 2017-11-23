import Ember from 'ember';

export default Ember.Component.extend({
	tagName: "tbody",
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	selectedSubservices: [],

	actions: {
		selectSubservice: function(id) {
			var subservices = this.get("selectedSubservices");
			let subservice = this.get("store").peekRecord('service', id);

			subservices.push(subservice);
			this.set("selectedSubservices", subservices);
		},
	}
});

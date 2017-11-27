import Ember from 'ember';

export default Ember.Component.extend({
	serviceService: Ember.inject.service("service-service"),
	addedSubservices: [],

	didInsertElement: function() {
		// add first empty row
		this.send("addSubserviceRow");
	},

	actions: {
		addSubserviceRow: function() {
			var serviceService = this.get("serviceService"),
				addedSubservices = serviceService.addSubserviceRow()

			this.set("addedSubservices", addedSubservices);
		}
	}
});

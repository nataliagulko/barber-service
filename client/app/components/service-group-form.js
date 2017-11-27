import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	serviceService: Ember.inject.service("service-service"),

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {
		save: function() {
			const serviceToGroup = this.get("serviceToGroup");
			const serviceGroupRecord = this.get("serviceGroup");
			const masters = this.get("selectedMasters");

			serviceGroupRecord.set("masters", masters);
			serviceGroupRecord.save();
		},

		selectMaster: function(id) {
			var serviceService = this.get("serviceService");

			serviceService.selectMaster(id);
		}
	}
});

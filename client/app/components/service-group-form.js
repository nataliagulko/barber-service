import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	serviceService: Ember.inject.service("service-service"),
	selectedMasters: [],

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {
		save: function() {
			const serviceGroupRecord = this.get("serviceGroup");
			const masters = this.get("selectedMasters");

			serviceGroupRecord.set("masters", masters);
			serviceGroupRecord.save();
		},

		selectMaster: function(masterId) {
			var serviceService = this.get("serviceService"),
				masters = serviceService.selectMaster(masterId);
				
			this.set("selectedMasters", masters);
		}
	}
});

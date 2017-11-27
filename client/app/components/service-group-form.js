import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	serviceService: Ember.inject.service("service-service"),
	servicesToGroup: Ember.computed.readOnly('serviceService.servicesToGroup'),
	selectedMasters: Ember.computed.readOnly('serviceService.selectedMasters'),

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {
		save: function() {
			const serviceGroupRecord = this.get("serviceGroup");
			const servicesToGroup = this.get("servicesToGroup");
			const masters = this.get("selectedMasters");

			servicesToGroup.forEach(function(item, ind) {
				// item.set("serviceGroup", record);
				// ? item.set("service", record);
				item.set("serviceOrder", ind);
				item.set("serviceTimeout", 0);
				console.log(item);
			});

			serviceGroupRecord.set("masters", masters);
			// serviceGroupRecord.save().then(function(record) {

			// 	servicesToGroup.forEach(function(item) {

			// 	});
			// });
		},

		selectMaster: function(masterId) {
			var serviceService = this.get("serviceService");

			serviceService.selectMaster(masterId);
		}
	}
});

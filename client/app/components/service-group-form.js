import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	serviceService: Ember.inject.service("service-service"),
	servicesToGroup: Ember.computed.readOnly('serviceService.servicesToGroup'),
	selectedMasters: Ember.computed.readOnly('serviceService.selectedMasters'),
	serviceGroupCost: Ember.computed.readOnly('serviceService.serviceGroupCost'),
	serviceGroupTime: Ember.computed.readOnly('serviceService.serviceGroupTime'),

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {
		save: function() {
			const serviceGroupRecord = this.get("serviceGroup");
			var serviceService = this.get("serviceService");

			// serviceGroupRecord
			// 	.validate()
			// 	.then(({ validations }) => {
			// 		if (validations.get('isValid')) {
						serviceService.saveServiceGroup(serviceGroupRecord);
				// 	}
				// });
		},

		selectMaster: function(masterId) {
			var serviceService = this.get("serviceService");

			serviceService.selectMaster(masterId);
		}
	}
});

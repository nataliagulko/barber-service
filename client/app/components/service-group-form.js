import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	serviceService: Ember.inject.service("service-service"),
	servicesToGroup: Ember.computed.readOnly('serviceService.servicesToGroup'),
	selectedMasters: [],

	didInsertElement() {
		const serviceGroupRecord = this.get("serviceGroup"),
			masters = serviceGroupRecord.get("masters");

		this.set("selectedMasters", masters);
	},

	actions: {
		save: function() {
			const serviceGroupRecord = this.get("serviceGroup");
			var serviceService = this.get("serviceService"),
				selectedMasters = this.get("selectedMasters");

			serviceGroupRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						serviceService.saveServiceGroup(serviceGroupRecord, selectedMasters);
					}
				});
		}
	}
});

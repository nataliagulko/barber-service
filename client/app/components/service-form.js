import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	serviceService: Ember.inject.service("service-service"),
	selectedMasters: [],

	actions: {
		save: function() {
			const serviceRecord = this.get("service");
			var serviceService = this.get("serviceService"),
				selectedMasters = this.get("selectedMasters");

			serviceRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						serviceService.saveService(serviceRecord, selectedMasters);
					}
				});

		}
	}
});

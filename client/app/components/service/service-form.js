import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	serviceService: Ember.inject.service("service-service"),
	selectedMasters: [],

	didInsertElement() {
		const serviceRecord = this.get("service"),
			masters = serviceRecord.get("masters").toArray();

		this.set("selectedMasters", masters);
	},

	actions: {
		save: function () {
			const serviceRecord = this.get("service");

			let serviceService = this.get("serviceService"),
				selectedMasters = this.get("selectedMasters"),
				_this = this;

			serviceRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						serviceService.saveService(serviceRecord, selectedMasters, _this);
					}
				});

		}
	}
});

import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service("store"),
	selectedMasters: [],
	addedSubservices: [],
	selectedSubservices: [],

	selectMaster: function(id) {
		var masters = this.get("selectedMasters");
		let master = this.get("store").peekRecord('master', id);

		masters.pushObject(master);
	},

	addSubserviceRow: function() {
		var addedSubservices = this.get("addedSubservices"),
			newRow = {
				subservices: [],
				timeout: 0,
				order: 0,
				id: 0
			};

		addedSubservices.pushObject(newRow);
		return addedSubservices;
	},

	selectSubservice: function(id) {
		var subservices = this.get("selectedSubservices"),
			subservice = this.get("store").peekRecord('service', id),
			addedSubservices = this.get("addedSubservices");

		console.log(addedSubservices);
		subservices.pushObject(subservice);
	},

	removeSubserviceRow: function(subserviceId) {
		var addedSubservices = this.get("addedSubservices");

		console.log(subserviceId);
	}
});

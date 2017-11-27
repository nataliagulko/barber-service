import Ember from 'ember';
import { uuid } from 'ember-cli-uuid';

export default Ember.Service.extend({
	store: Ember.inject.service("store"),
	selectedMasters: [],
	addedSubservices: [],
	selectedSubservices: [],

	selectMaster: function(id) {
		var masters = this.get("selectedMasters");
		let master = this.get("store").peekRecord('master', id);

		masters.pushObject(master);
		return masters;
	},

	addSubserviceRow: function() {
		var addedSubservices = this.get("addedSubservices"),
			newRow = {
				subservices: [],
				timeout: 0,
				order: 0,
				id: uuid()
			};

		addedSubservices.pushObject(newRow);
		return addedSubservices;
	},

	selectSubservice: function(id) {
		var subservices = this.get("selectedSubservices"),
			subservice = this.get("store").peekRecord('service', id),
			addedSubservices = this.get("addedSubservices");

		const rowId = $("[name=rowId]");

		console.log(rowId);
		console.log(id);
		subservices.pushObject(subservice);
	},

	removeSubserviceRow: function(subserviceId) {
		var addedSubservices = this.get("addedSubservices");

		console.log(subserviceId);
	}
});

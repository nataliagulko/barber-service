import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service("store"),
	selectedMasters: [],
	servicesToGroup: [],
	selectedSubservices: [],
	isRowAddingDisabled: false,

	selectMaster: function(id) {
		var masters = this.get("selectedMasters");
		let master = this.get("store").peekRecord('master', id);

		masters.pushObject(master);
	},

	addServiceToGroup: function() {
		var servicesToGroup = this.get("servicesToGroup"),
			serviceToGroupRecord = this.get("store").createRecord("serviceToGroup");

		servicesToGroup.pushObject(serviceToGroupRecord);
		this.changeIsRowAddingDisabled();
	},

	selectSubservice: function(subserviceId) {
		if (typeof subserviceId === "undefined" || subserviceId === "") {
			return;
		}

		var subservices = this.get("selectedSubservices"),
			subservice = this.get("store").peekRecord('service', subserviceId);

		subservices.pushObject(subservice);
		this.changeIsRowAddingDisabled();
	},

	removeServiceToGroup: function(record) {
		var servicesToGroup = this.get("servicesToGroup");

		record.destroyRecord("serviceToGroup");
		servicesToGroup.removeObject(record);
		this.changeIsRowAddingDisabled();
	},

	changeIsRowAddingDisabled: function() {
		// if subservices not chosen
		// if servicesToGroup list is empty

		var isRowAddingDisabled = this.get("isRowAddingDisabled"),
			servicesToGroup = this.get("servicesToGroup"),
			selectedSubservices = this.get("selectedSubservices");

		if (selectedSubservices.length > 0 && servicesToGroup.length > 0) {
			isRowAddingDisabled = false;
		} else {
			isRowAddingDisabled = true;
		}

		this.set("isRowAddingDisabled", isRowAddingDisabled);
	},

	reorderSubservices: function(subservicesArr) {
		this.set("servicesToGroup", subservicesArr);
	}
});

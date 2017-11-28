import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service("store"),
	selectedMasters: [],
	servicesToGroup: [],
	selectedSubservices: [],
	serviceGroupCost: 0,
	serviceGroupTime: 0,
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

	selectSubservice: function(subserviceId, serviceToGroup) {
		if (typeof subserviceId === "undefined" || subserviceId === "") {
			return;
		}

		var subservices = this.get("selectedSubservices"),
			subservice = this.get("store").peekRecord('service', subserviceId);

		serviceToGroup.set("service", subservice);
		subservices.pushObject(subservice);
		this.addServiceGroupCostAndTime(subservice);
		this.changeIsRowAddingDisabled();
	},

	addServiceGroupCostAndTime: function(subservice) {
		var serviceGroupCost = this.get("serviceGroupCost"),
			serviceGroupTime = this.get("serviceGroupTime");

		serviceGroupCost += subservice.get("cost");
		serviceGroupTime += subservice.get("time");;

		this.set("serviceGroupCost", serviceGroupCost);
		this.set("serviceGroupTime", serviceGroupTime);
	},

	subtractServiceGroupCostAndTime: function(subservice) {
		var serviceGroupCost = this.get("serviceGroupCost"),
			serviceGroupTime = this.get("serviceGroupTime");

		serviceGroupCost -= subservice.get("cost");
		serviceGroupTime -= subservice.get("time");;

		this.set("serviceGroupCost", serviceGroupCost);
		this.set("serviceGroupTime", serviceGroupTime);
	},

	removeServiceToGroup: function(record) {
		var servicesToGroup = this.get("servicesToGroup");

		record.destroyRecord("serviceToGroup");
		servicesToGroup.removeObject(record);
		this.subtractServiceGroupCostAndTime(record);
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

	reorderSubservices: function(subservicesOrderedArr) {
		this.set("servicesToGroup", subservicesOrderedArr);
	},

	saveService: function(serviceRecord) {
		const masters = this.get("selectedMasters");

		serviceRecord.set("masters", masters);
		serviceRecord.save();
	},

	saveServiceGroup: function(serviceGroupRecord) {
		const servicesToGroup = this.get("servicesToGroup");
		const masters = this.get("selectedMasters");

		serviceGroupRecord.set("masters", masters);
		serviceGroupRecord.save().then(function(record) {
			servicesToGroup.forEach(function(item, ind) {
				item.set("serviceGroup", record);
				item.set("serviceOrder", ind);
				item.save();
			});
		});
	}
});

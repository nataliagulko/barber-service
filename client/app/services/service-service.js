import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service("store"),
	selectedMasters: [],
	servicesToGroup: [],
	selectedSubservices: [],
	serviceToGroupTimeout: 0,
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
		this._changeIsRowAddingDisabled();
	},

	selectSubservice: function(subserviceId, serviceToGroup, serviceGroup) {
		if (typeof subserviceId === "undefined" || subserviceId === "") {
			return;
		}

		var subservices = this.get("selectedSubservices"),
			subservice = this.get("store").peekRecord('service', subserviceId);

		serviceToGroup.set("service", subservice);
		subservices.pushObject(subservice);
		this._addServiceGroupCostAndTime(subservice, serviceGroup);
		this._changeIsRowAddingDisabled();
	},

	_addServiceGroupCostAndTime: function(subservice, serviceGroup) {
		var serviceGroupCost = serviceGroup.get("cost"),
			serviceGroupTime = serviceGroup.get("time");

		serviceGroupCost += subservice.get("cost");
		serviceGroupTime += subservice.get("time");

		serviceGroup.set("cost", serviceGroupCost);
		serviceGroup.set("time", serviceGroupTime);
	},

	_subtractServiceGroupCostAndTime: function(serviceToGroup, serviceGroup) {
		var serviceGroupCost = serviceGroup.get("cost"),
			serviceGroupTime = serviceGroup.get("time"),
			subservice = serviceToGroup.get("service");

		serviceGroupCost -= subservice.get("cost");
		serviceGroupTime -= subservice.get("time");

		serviceGroup.set("cost", serviceGroupCost);
		serviceGroup.set("time", serviceGroupTime);
	},

	removeServiceToGroup: function(record, serviceGroup) {
		var servicesToGroup = this.get("servicesToGroup");

		record.destroyRecord("serviceToGroup");
		servicesToGroup.removeObject(record);
		this._subtractServiceGroupCostAndTime(record, serviceGroup);
		this._changeIsRowAddingDisabled();
	},

	_changeIsRowAddingDisabled: function() {
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

	inputServiceToGroupTimeout: function(serviceGroup) {
		var serviceGroupTime = serviceGroup.get("time"),
			// previous saved summary of timeouts:
			serviceToGroupTimeout = this.get("serviceToGroupTimeout"),
			// current summary of timeouts
			serviceTimeout = 0,
			$timeouts = Ember.$("[name=serviceTimeout]");

		$timeouts.each(function(ind, elem) {
			serviceTimeout += Number(elem.value);
		});

		// subtract previous timeouts
		serviceGroupTime -= serviceToGroupTimeout;
		// add current timeouts
		serviceGroupTime += serviceTimeout;
		// save current timeouts
		serviceToGroupTimeout = serviceTimeout;
		serviceGroup.set("time", serviceGroupTime);
		this.set("serviceToGroupTimeout", serviceToGroupTimeout);
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
				item.set("group", record);
				item.set("serviceOrder", ind);
				item.save();
			});
		});
	}
});

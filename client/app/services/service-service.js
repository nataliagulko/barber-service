import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service("store"),
	selectedMasters: [],
	servicesToGroup: [],
	selectedSubservices: [],
	serviceGroupCost: 0,
	serviceGroupTime: 0,
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
		var serviceGroupCost = this.get("serviceGroupCost"),
			serviceGroupTime = this.get("serviceGroupTime");

		serviceGroupCost += subservice.get("cost");
		serviceGroupTime += subservice.get("time");

		this.set("serviceGroupCost", serviceGroupCost);
		this.set("serviceGroupTime", serviceGroupTime);
		// set cost and time for serviceGroup record
		serviceGroup.set("cost", serviceGroupCost);
		serviceGroup.set("time", serviceGroupTime);
	},

	_subtractServiceGroupCostAndTime: function(serviceToGroup, serviceGroup) {
		var serviceGroupCost = this.get("serviceGroupCost"),
			serviceGroupTime = this.get("serviceGroupTime"),
			subservice = serviceToGroup.get("service");

		serviceGroupCost -= subservice.get("cost");
		serviceGroupTime -= subservice.get("time");

		this.set("serviceGroupCost", serviceGroupCost);
		this.set("serviceGroupTime", serviceGroupTime);
		// set cost and time for serviceGroup record
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

	inputServiceToGroupTimeout: function() {
		var serviceGroupTime = this.get("serviceGroupTime"),
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
		this.set("serviceGroupTime", serviceGroupTime);
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
		const serviceGroupCost = this.get("serviceGroupCost");
		const serviceGroupTime = this.get("serviceGroupTime");

		serviceGroupRecord.set("masters", masters);
		serviceGroupRecord.set("cost", serviceGroupCost);
		serviceGroupRecord.set("time", serviceGroupTime);

		serviceGroupRecord.save().then(function(record) {
			servicesToGroup.forEach(function(item, ind) {
				item.set("serviceGroup", record);
				item.set("serviceOrder", ind);
				item.save();
			});
		});
	}
});

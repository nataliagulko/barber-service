import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service("store"),
	servicesToGroup: [],
	selectedSubservices: [],
	serviceToGroupTimeout: 0,
	isRowAddingDisabled: false,

	addServiceToGroup: function() {
		var servicesToGroup = this.get("servicesToGroup"),
			serviceToGroupRecord = this.get("store").createRecord("serviceToGroup");

		servicesToGroup.pushObject(serviceToGroupRecord);
		this._changeIsRowAddingDisabled();
	},

	selectSubservice: function(subservice, serviceToGroup, serviceGroup) {
		if (typeof subservice === "undefined") {
			return;
		}

		var subservices = this.get("selectedSubservices");

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

	saveService: function(serviceRecord, masters, _this) {
		serviceRecord.set("masters", masters);
		serviceRecord
			.save()
			.then(() => {
				_this.get("router").transitionTo('service');
			});
	},

	saveServiceGroup: function(serviceGroupRecord, masters, _this) {
		const servicesToGroup = this.get("servicesToGroup");

		serviceGroupRecord.set("masters", masters);
		serviceGroupRecord
			.save()
			.then(function(record) {
				servicesToGroup.forEach(function(item, ind) {
					item.set("serviceGroup", record);
					item.set("serviceOrder", ind);
					item.save();
				});
				_this.get("router").transitionTo('service');
			});
	}
});

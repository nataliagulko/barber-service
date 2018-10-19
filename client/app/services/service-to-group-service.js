import Service from '@ember/service';
import { inject } from '@ember/service';

export default Service.extend({
	store: inject("store"),
	servicesToGroup: [],
	serviceToGroupTimeout: 0,
	isRowAddingDisabled: false,

	addServiceToGroup: function () {
		let servicesToGroup = this.servicesToGroup;
		const serviceToGroupRecord = this.store.createRecord("serviceToGroup");

		servicesToGroup.pushObject(serviceToGroupRecord);
		this._changeIsRowAddingDisabled();
	},

	showSubservices: function (serviceGroup, _this) {
		let servicesToGroup = serviceGroup.get("servicesToGroup").toArray();

		if (servicesToGroup.get("length") > 0) {
			servicesToGroup = servicesToGroup.sortBy("serviceOrder");
			this.set("servicesToGroup", servicesToGroup);
		} else {
			this.set("servicesToGroup", []);
			_this.send("addServiceToGroup");
		}
	},

	selectSubservice: function (serviceToGroup, subservice, serviceGroup) {
		if (typeof subservice === "undefined") {
			return;
		}

		serviceToGroup.set("service", subservice);
		this._calculateServiceGroupCostAndTime(serviceGroup);
		this._changeIsRowAddingDisabled();
	},

	_calculateServiceGroupCostAndTime: function (serviceGroup) {
		const servicesToGroup = this.servicesToGroup;

		let serviceGroupCost = 0;
		let serviceGroupTime = 0;

		servicesToGroup.forEach(function (serviceToGroup) {
			const innerService = serviceToGroup.get("service");

			serviceGroupCost += innerService.get("cost");
			serviceGroupTime += Number(serviceToGroup.get("serviceTimeout"));
			serviceGroupTime += innerService.get("time");
		});

		serviceGroup.set("cost", Number(serviceGroupCost));
		serviceGroup.set("time", Number(serviceGroupTime));
	},

	_changeIsRowAddingDisabled: function () {
		// if subservices not chosen
		// if servicesToGroup list is empty

		const servicesToGroup = this.servicesToGroup;
		const isRowAddingDisabled = servicesToGroup.get("length") > 0 ? false : true;

		this.set("isRowAddingDisabled", isRowAddingDisabled);
	},

	removeServiceToGroup: function (record, serviceGroup) {
		let servicesToGroup = this.servicesToGroup;

		servicesToGroup.removeObject(record);
		record.destroyRecord("serviceToGroup");

		this._calculateServiceGroupCostAndTime(serviceGroup);
		this._changeIsRowAddingDisabled();
	},

	reorderSubservices: function (subservicesOrderedArr) {
		this.set("servicesToGroup", subservicesOrderedArr);
	},

	inputServiceToGroupTimeout: function (serviceGroup) {
		this._calculateServiceGroupCostAndTime(serviceGroup);
	},
});

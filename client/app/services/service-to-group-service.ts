import { get, set } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import SubserviceList from "nova/components/service/subservice-list";
import ServiceModel from "nova/models/service";
import ServiceGroup from "nova/models/service-group";
import ServiceToGroup from "nova/models/service-to-group";

export default class ServiceToGroupService extends Service {
	servicesToGroup: ServiceToGroup[] = []
	serviceToGroupTimeout: number = 0
	isRowAddingDisabled: boolean = false

	store = service("store")

	addServiceToGroup(this: ServiceToGroupService) {
		const store = get(this, "store")
		const servicesToGroup = get(this, "servicesToGroup")
		const serviceToGroupRecord = store.createRecord("serviceToGroup")

		servicesToGroup.pushObject(serviceToGroupRecord);
		this._changeIsRowAddingDisabled();
	}

	showSubservices(this: ServiceToGroupService, serviceGroup: ServiceGroup, component: SubserviceList) {
		let servicesToGroup = get(serviceGroup, "servicesToGroup").toArray();

		if (get(servicesToGroup, "length") > 0) {
			servicesToGroup = servicesToGroup.sortBy("serviceOrder");
			set(this, "servicesToGroup", servicesToGroup);
		} else {
			set(this, "servicesToGroup", []);
			component.send("addServiceToGroup");
		}
	}

	selectSubservice(this: ServiceToGroupService, serviceToGroup: ServiceToGroup, subservice: ServiceModel, serviceGroup: ServiceGroup) {
		if (typeof subservice === "undefined") {
			return;
		}

		set(serviceToGroup, "service", subservice);
		this._calculateServiceGroupCostAndTime(serviceGroup);
		this._changeIsRowAddingDisabled();
	}

	_calculateServiceGroupCostAndTime(this: ServiceToGroupService, serviceGroup: ServiceGroup) {
		const servicesToGroup = get(this, "servicesToGroup")

		let serviceGroupCost = 0;
		let serviceGroupTime = 0;

		servicesToGroup.forEach((serviceToGroup) => {
			const innerService = get(serviceToGroup, "service");

			serviceGroupCost += get(innerService, "cost");
			serviceGroupTime += get(serviceToGroup, "serviceTimeout")
			serviceGroupTime += get(innerService, "time");
		});

		set(serviceGroup, "cost", serviceGroupCost)
		set(serviceGroup, "time", serviceGroupTime)
	}

	_changeIsRowAddingDisabled(this: ServiceToGroupService) {
		// if subservices not chosen
		// if servicesToGroup list is empty

		const servicesToGroup = get(this, "servicesToGroup")
		const isRowAddingDisabled = get(servicesToGroup, "length") > 0 ? false : true;

		set(this, "isRowAddingDisabled", isRowAddingDisabled);
	}

	removeServiceToGroup(this: ServiceToGroupService, record: ServiceToGroup, serviceGroup: ServiceGroup) {
		const servicesToGroup = get(this, "servicesToGroup")

		servicesToGroup.removeObject(record);
		record.destroyRecord("serviceToGroup");

		this._calculateServiceGroupCostAndTime(serviceGroup);
		this._changeIsRowAddingDisabled();
	}

	reorderSubservices(this: ServiceToGroupService, subservicesOrderedArr: ServiceToGroup[]) {
		set(this, "servicesToGroup", subservicesOrderedArr);
	}

	inputServiceToGroupTimeout(this: ServiceToGroupService, serviceGroup: ServiceGroup) {
		this._calculateServiceGroupCostAndTime(serviceGroup);
	}
}

declare module "@ember/service" {
	interface Registry {
		"service-to-group-service": ServiceToGroupService;
	}
}

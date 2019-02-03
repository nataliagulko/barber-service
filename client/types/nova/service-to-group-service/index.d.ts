import Service from "@ember/service";
import ServiceToGroup from "nova/models/service-to-group";
import ServiceGroup from "nova/models/service-group";
import ServiceModel from "nova/models/service";
import SubserviceList from "nova/components/service/subservice-list";

export default class ServiceToGroupService extends Service {
	servicesToGroup: ServiceToGroup[]
	serviceToGroupTimeout: number
	isRowAddingDisabled: boolean

	addServiceToGroup(): void
	showSubservices(serviceGroup: ServiceGroup, component: SubserviceList): void
	selectSubservice(serviceToGroup: ServiceToGroup, subservice: ServiceModel, serviceGroup: ServiceGroup): void
	removeServiceToGroup(record: ServiceToGroup, serviceGroup: ServiceGroup): void
	reorderSubservices(subservicesOrderedArr: ServiceToGroup[]): void
	inputServiceToGroupTimeout(serviceGroup: ServiceGroup): void
}

declare module '@ember/service' {
	interface Registry {
		"service-to-group-service": ServiceToGroupService;
	}
}
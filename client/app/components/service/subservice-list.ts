import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import Service from "nova/models/service";
import ServiceGroup from "nova/models/service-group";
import ServiceToGroup from "nova/models/service-to-group";

export default class SubserviceList extends Component {
	serviceGroup!: ServiceGroup

	store = service("store")
	serviceToGroupService = service("service-to-group-service")

	@reads("serviceToGroupService.servicesToGroup")
	servicesToGroup!: ServiceToGroup[]

	@reads("serviceToGroupService.isRowAddingDisabled")
	isRowAddingDisabled!: boolean

	didInsertElement(this: SubserviceList) {
		const serviceToGroupService = get(this, "serviceToGroupService")
		const serviceGroup = get(this, "serviceGroup")

		serviceToGroupService.showSubservices(serviceGroup, this);
	}

	actions = {
		addServiceToGroup(this: SubserviceList) {
			get(this, "serviceToGroupService").addServiceToGroup();
		},

		removeServiceToGroup(this: SubserviceList, subservice: ServiceToGroup) {
			const serviceGroup = get(this, "serviceGroup")

			get(this, "serviceToGroupService").removeServiceToGroup(subservice, serviceGroup);
		},

		reorderSubservices(this: SubserviceList, groupModel: ServiceToGroup[]) {
			get(this, "serviceToGroupService").reorderSubservices(groupModel);
		},

		inputServiceToGroupTimeout(this: SubserviceList) {
			const serviceGroup = get(this, "serviceGroup")

			get(this, "serviceToGroupService").inputServiceToGroupTimeout(serviceGroup);
		},

		selectSubservice(this: SubserviceList, serviceToGroup: ServiceToGroup, subservice: Service) {
			const serviceGroup = get(this, "serviceGroup")

			get(this, "serviceToGroupService").selectSubservice(serviceToGroup, subservice, serviceGroup);
		},
	}
}

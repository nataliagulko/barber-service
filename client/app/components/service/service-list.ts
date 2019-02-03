import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import $ from "jquery";
import Service from "nova/models/service";
import ServiceGroup from "nova/models/service-group";

export default class ServiceList extends Component {
	store = service("store")
	router = service("router")
	bootbox = service("bootbox-service")

	didInsertElement() {
		const $table = $("#service-list");
		$table.dataTable();
	}

	actions = {
		edit(this: ServiceList, serviceRecord: Service | ServiceGroup) {
			const router = get(this, "router")
			const extension = serviceRecord.get("extensionShort");

			if (extension === "ServiceGroup") {
				router.transitionTo("/auth/service-group/edit/" + serviceRecord.id);
			} else {
				router.transitionTo("/auth/service/edit/" + serviceRecord.id);
			}
		},

		delete(this: ServiceList, serviceRecord: Service | ServiceGroup) {
			const store = get(this, "store")
			const bootbox = get(this, "bootbox")
			const extension = get(serviceRecord, "extensionShort")

			if (extension === "ServiceGroup") {
				bootbox.confirmDelete(store, "service-group", serviceRecord.id);
			} else {
				bootbox.confirmDelete(store, "service", serviceRecord.id);
			}
		},
	}
}

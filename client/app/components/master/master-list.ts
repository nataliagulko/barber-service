import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";

export default class MasterList extends Component {
	store = service("store")
	bootbox = service("bootbox-service")

	didInsertElement() {
		const $table = $("#master-list");
		$table.dataTable();
	}

	actions = {
		delete(this: MasterList, id: number) {
			const store = get(this, "store")
			const bootbox = get(this, "bootbox")

			bootbox.confirmDelete(store, "master", id);
		},
	}
}

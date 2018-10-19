import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
	store: inject("store"),
	bootbox: inject("bootbox-service"),

	didInsertElement: function() {
		var $table = $("#service-list");
		$table.dataTable();
	},

	actions: {
		edit: function(service) {
			const extension = service.get("extensionShort");

			if (extension === "ServiceGroup") {
				this.router.transitionTo('/auth/service-group/edit/' + service.id);
			} else {
				this.router.transitionTo('/auth/service/edit/' + service.id);
			}
		},

		delete: function(service) {
			const store = this.store,
				extension = service.get("extensionShort");

			if (extension === "ServiceGroup") {
				this.bootbox.confirmDelete(store, "service-group", service.id, "услугу");
			} else {
				this.bootbox.confirmDelete(store, "service", service.id, "услугу");
			}
		}
	}
});

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
				this.get("router").transitionTo('/auth/service-group/edit/' + service.id);
			} else {
				this.get("router").transitionTo('/auth/service/edit/' + service.id);
			}
		},

		delete: function(service) {
			const store = this.get("store"),
				extension = service.get("extensionShort");

			if (extension === "ServiceGroup") {
				this.get("bootbox").confirmDelete(store, "service-group", service.id, "услугу");
			} else {
				this.get("bootbox").confirmDelete(store, "service", service.id, "услугу");
			}
		}
	}
});

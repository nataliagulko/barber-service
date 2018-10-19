import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
	store: service("store"),
	bootbox: service("bootbox-service"),

	didInsertElement: function() {
		var $table = $("#master-list");
		$table.dataTable();
	},

	actions: {
		delete: function(id) {
			var store = this.store;

			this.bootbox.confirmDelete(store, "master", id, "мастера");
		}
	}
});

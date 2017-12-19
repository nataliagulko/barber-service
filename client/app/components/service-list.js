import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	bootbox: Ember.inject.service("bootbox-service"),

	didInsertElement: function() {
		var $table = $("#service-list");
		$table.dataTable();
	},

	actions: {
		edit: function(service) {
			var extension = service.get("extensionShort");
			
			if (extension === "ServiceGroup") {
				this.get("router").transitionTo('/service-group/edit/' + service.id);
			} else {
				this.get("router").transitionTo('/service/edit/' + service.id);
			}
		},

		delete: function(id) {
			var store = this.get("store");
			this.get("bootbox").confirmDelete(store, "service", id, "услугу");
		}
	}
});

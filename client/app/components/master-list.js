import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	bootbox: Ember.inject.service("bootbox-service"),

	didInsertElement: function() {
		var $table = $("#master-list");
		$table.dataTable();
	},

	actions: {
		delete: function(id) {
			var store = this.get("store");

			this.get("bootbox").confirmDelete(store, "master", id);
		}
	}
});

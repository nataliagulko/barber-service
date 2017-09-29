import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement: function() {
		var $table = $("#master-list");
		$table.dataTable();
	},
});

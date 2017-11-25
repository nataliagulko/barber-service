import Ember from 'ember';

export default Ember.Component.extend({
	addRow: false,

	actions: {
		addSubserviceRow: function() {
			this.toggleProperty("addRow");
		}
	}
});

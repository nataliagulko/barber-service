import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	selectedMasters: [],

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {
		save: function() {
			const isPartOfList = this.get("isPartOfList");
			const serviceRecord = this.get("service");
			const masters = this.get("selectedMasters");

			serviceRecord.set("masters", masters);
			serviceRecord.save();
		},

		selectMaster: function(id) {
			var masters = this.get("selectedMasters");
			let master = this.get("store").peekRecord('master', id);

			masters.push(master);
			this.set("selectedMasters", masters);
		}
	}
});

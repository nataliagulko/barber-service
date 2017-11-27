import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	selectedMasters: [],
	isPartOfList: false,

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {
		save: function() {
			const isPartOfList = this.get("isPartOfList");
			const serviceToGroup = this.get("serviceToGroup");
			const serviceGroupRecord = this.get("serviceGroup");
			const masters = this.get("selectedMasters");

			serviceGroupRecord.set("masters", masters);
			serviceGroupRecord.save();
		},

		selectMaster: function(id) {
			var masters = this.get("selectedMasters");
			let master = this.get("store").peekRecord('master', id);

			masters.push(master);
			this.set("selectedMasters", masters);
		},

		checkPartOfList: function() {
			this.get('isPartOfList');
		}.observes('isPartOfList')
	}
});

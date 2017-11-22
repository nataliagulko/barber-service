import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	validateService: Ember.inject.service("validate-service"),
	isPartOfList: false,
	selectedMasters: [],
	rules: {
		name: 'required',
		cost: 'required',
		time: 'required',
	},

	actions: {
		save: function() {
			const serviceRecord = this.get("service");
			const serviceToGroup = this.get("serviceToGroup");
			//const serviceGroup = this.get("serviceGroup");
			const masters = this.get("selectedMasters");

			serviceRecord.set("masters", masters);
			// serviceToGroup.save();
			serviceRecord.save();
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

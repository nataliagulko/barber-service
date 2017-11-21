import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	validateService: Ember.inject.service("validate-service"),
	isPartOfList: false,
	selectedMasters: [],

	didInsertElement: function() {
		var validateService = this.get('validateService'),
			options = {
				rules: {
					name: 'required',
					cost: 'required',
					time: 'required',
					//masters: 'required'
				}
			};

		validateService.validateForm('#service-form', options);
	},

	actions: {
		save: function() {
			const serviceRecord = this.get("service");
			const serviceToGroup = this.get("serviceToGroup");
			const serviceGroup = this.get("serviceGroup");
			const masters = this.get("selectedMasters");
			const serviceToGroupRel = this.get("serviceToGroup");

			serviceRecord.set("masters", masters);
			// serviceRecord.set("serviceToGroup", serviceToGroupRel);
			serviceRecord.save();
		},

		selectMaster: function(master) {
			var masters = this.get("selectedMasters");

			// const masterRecord = this.get("store").findRecord("master", master.id);
			// masters.push(masterRecord);
			// this.set("selectedMasters", masters);
			console.log(master);
			console.log(masters);
		},

		checkPartOfList: function() {
			this.get('isPartOfList');
		}.observes('isPartOfList')
	}
});

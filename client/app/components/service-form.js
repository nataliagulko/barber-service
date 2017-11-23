import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	selectedMasters: [],
	isServiceGroup: false,
	isPartOfList: false,

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {
		save: function() {
			const isPartOfList = this.get("isPartOfList");
			const isServiceGroup = this.get("isServiceGroup");

			if (!isPartOfList && isServiceGroup) {
				this.saveServiceGroup();
			} else {
				this.saveService();
			}
		},

		selectMaster: function(id) {
			var masters = this.get("selectedMasters");
			let master = this.get("store").peekRecord('master', id);

			masters.push(master);
			this.set("selectedMasters", masters);
		},

		toggleIsServiceGroup: function() {
			let isServiceGroup = this.get("isServiceGroup");

			if (isServiceGroup) {
				isServiceGroup = false;
			} else {
				isServiceGroup = true;
			}

			this.set("isServiceGroup", isServiceGroup);
		},

		checkPartOfList: function() {
			this.get('isPartOfList');
		}.observes('isPartOfList')
	},

	saveServiceGroup: function() {
		const serviceToGroup = this.get("serviceToGroup");
		const serviceGroupRecord = this.get("serviceGroup");
		const masters = this.get("selectedMasters");

		serviceGroupRecord.set("masters", masters);
		serviceGroupRecord.save();
	},

	saveService: function() {
		const serviceRecord = this.get("service");
		const masters = this.get("selectedMasters");

		serviceRecord.set("masters", masters);
		serviceRecord.save();
	}
});

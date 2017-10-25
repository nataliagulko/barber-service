import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	validateService: Ember.inject.service("validate-service"),
	isPartOfList: false,

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
		$("#master-list").select2();
		$("#subservice-list").select2();
	},

	actions: {
		save: function() {
			const serviceRecord = this.get("service");
			serviceRecord.save();
		},

		checkPartOfList: function() {
			this.get('isPartOfList');
		}.observes('isPartOfList'),

		updateValue: function(value) {
			const serviceRecord = this.get("service");

			console.log(value);
		},

		foo: function() {
			
		}
	}
});

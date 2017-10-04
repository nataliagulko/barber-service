import Ember from 'ember';

export default Ember.Component.extend({
	validateService: Ember.inject.service("validate-service"),
	isPartOfList: false,

	didInsertElement: function() {
		var validateService = this.get('validateService'),
		select2Service = this.get('select2Service'),
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
			this.get("service").save();
		},

		checkPartOfList: function() {
			console.log("checked");
		}
	}
});

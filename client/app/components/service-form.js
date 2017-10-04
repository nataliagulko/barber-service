import Ember from 'ember';

export default Ember.Component.extend({
	validateService: Ember.inject.service("validate-service"),
	bootstrapSelectService: Ember.inject.service("bootstrap-select-service"),

	didInsertElement: function() {
		var validateService = this.get('validateService'),
		bootstrapSelectService = this.get('bootstrapSelectService'),
			options = {
				rules: {
					name: 'required',
					cost: 'required',
					time: 'required',
					//masters: 'required'
				}
			};

		validateService.validateForm('#service-form', options);
		bootstrapSelectService.initSelectpicker("#master-list");
		bootstrapSelectService.initSelectpicker("#subservice-list");
	},

	actions: {
		saveService: function() {
			this.get("service").save();
		}
	}
});

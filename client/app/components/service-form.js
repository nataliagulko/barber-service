import Ember from 'ember';

export default Ember.Component.extend({
	validateService: Ember.inject.service("validate-service"),

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
		saveService: function(service) {
			service.save();
		}
	}
});

import Ember from 'ember';

export default Ember.Component.extend({
	validateService: Ember.inject.service("validate-service"),

	didInsertElement() {
		var validateService = this.get("validateService"),
			options = {
				rules: {
					firstname: "required",
					secondname: "required",
					phone: "required",
					email: "email"
				}
			};

		validateService.validateForm("#master-form", options);
	},

	actions: {
		save: function() {
			this.get("master")
				.save();
		}
	}
});

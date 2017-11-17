import Ember from 'ember';
import AuthentcatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

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

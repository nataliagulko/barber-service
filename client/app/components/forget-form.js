import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['forget-form'],
	validate: Ember.inject.service(),

	didInsertElement: function() {
		var validate = this.get('validate'),
			options = {
				rules: {
					phone: 'required'
				}
			};

		validate.validateForm('#forget-form', options);
	},

	actions: {
		showLoginForm: function() {
			$('.forget-form').hide();
			$('#login-form').show();
		},

		forget: function() {
			console.log('forget');
		}
	}
});

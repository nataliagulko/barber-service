import Ember from 'ember';

export default Ember.Service.extend({
	init() {
		Ember.$.validator.setDefaults({
			highlight: function(element) {
				$(element).closest('.form-group').addClass('has-error');
			},
			unhighlight: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			},
			errorElement: 'small',
			errorClass: 'help-block'
		});
	},

	validateForm(form, rules) {
		// при необходимости метод можно расширить

		$(form).validate({
			rules: rules
		});
	}
});

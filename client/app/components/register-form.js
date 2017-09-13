import Ember from 'ember';
import config from 'barbers/config/environment';

export default Ember.Component.extend({
	classNames: ["register-form"],
	session: Ember.inject.service(),
	toast: Ember.inject.service(),
	validateService: Ember.inject.service(),

	didInsertElement: function() {
		var validateService = this.get('validateService'),
			options = {
				rules: {
					phone: 'required',
					password: {
						required: true,
						minlength: 6,
						maxlength: 20
					},
					rpassword: {
						required: true,
						minlength: 6,
						maxlength: 20,
						equalTo: "#register-password"
					}
				}
			};

		validateService.validateForm('.register-form form', options);
	},

	actions: {
		showLoginForm: function() {
			$('.register-form').hide();
			$('#login-form').show();
		},

		register: function() {
			var params = $('.register-form form').serialize(),
				toast = this.get('toast'),
				options = {};

			$.post({
				url: config.host + '/UserAjax/create',
				data: params
			}).then((response) => {

				if (!response.msg) {
					this.send('showLoginForm');
				} else {
					toast.error(response.msg, '', options);
				}
			});
		}
	}
});

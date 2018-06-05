import Ember from 'ember';
import config from 'barbers/config/environment';

export default Ember.Component.extend({
	classNames: ['forget-form'],
	toast: Ember.inject.service(),
	isCodeSent: false,

	actions: {
		showLoginForm: function() {
			$("#forget-form")[0].reset();
			$('.forget-form').hide();
			$('#login-form').show();
		},

		sumbitCode: function() {
			var params = $("#forget-form").serialize(),
				toast = this.get('toast'),
				options = {};
				
			this.set('isCodeSent', true);

			$.post({
				url: config.host + '/register/createChangePassRequest',
				data: params
			}).then((response) => {

				if (!response.error) {
					$("#requestId").val(response.id);
					console.log(response.code);
				} else {
					toast.error(response.error, '', options);
				}
			});
		},

		checkCode: function() {
			var params = $("#forget-form").serialize(),
				toast = this.get('toast'),
				options = {};

			$.post({
				url: config.host + '/register/submitChangePassRequest',
				data: params
			}).then((response) => {

				if (!response.error) {
					$("#forget-form")[0].reset();
					this.send('showLoginForm');
				} else {
					toast.error(response.error, '', options);
				}
			});
		}
	}
});

import Ember from 'ember';
import config from 'barbers/config/environment';

export default Ember.Component.extend({
	classNames: ["register-form"],
	session: Ember.inject.service(),
	toast: Ember.inject.service(),

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

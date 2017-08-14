import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['forget-form'],

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

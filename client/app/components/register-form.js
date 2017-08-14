import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ["register-form"],

	actions: {
		showLoginForm: function() {
        	$('.register-form').hide();
        	$('#login-form').show();
        },

        register: function() {
        	console.log('register');
        }
	}
});

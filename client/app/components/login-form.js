import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['login-form'],
    session: Ember.inject.service(),

    actions: {
        authenticate: function() {
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'authenticator:token';

            this.get('session').authenticate(authenticator, credentials);
        },

        showRegisterForm: function() {
        	$('#login-form').hide();
        	$('.register-form').show();
        },

        showForgetForm: function() {
        	$('#login-form').hide();
        	$('.forget-form').show();
        }
    }

});

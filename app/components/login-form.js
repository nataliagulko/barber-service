import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['login-form'],
    session: Ember.inject.service(),
    validateService: Ember.inject.service("validate-service"),

    didInsertElement: function() {
        var validateService = this.get('validateService'),
            options = {
                rules: {
                    identification: 'required',
                    password: 'required'
                }
            };

        validateService.validateForm('#login-form', options);
    },

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

import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    session: inject(),
    constants: inject("constants-service"),
    phoneMask: readOnly("constants.PHONE_MASK"),

    actions: {
        authenticate: function () {
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'authenticator:token';

            this.get('session').authenticate(authenticator, credentials);
        },

        showForgetPassword: function () {
            this.set("isLoginShown", false);
        },
    }

});

import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    session: inject(),
    notification: inject("notification-service"),
    constants: inject("constants-service"),
    phoneMask: readOnly("constants.PHONE_MASK"),

    actions: {
        authenticate: function () {
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'authenticator:token';

            this.get('session').authenticate(authenticator, credentials)
                .then(() => { },
                    () => {
                        const message = this.get("i18n").t("auth.login.bad.credentials");
                        this.get("notification").showErrorMessage(message);
                    });
        },

        showForgetPassword: function () {
            this.set("isLoginShown", false);
        },
    }

});

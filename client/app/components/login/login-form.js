import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    session: inject(),
    notification: inject("notification-service"),
    constants: inject("constants-service"),
    phoneMask: readOnly("constants.PHONE_MASK"),
	intl: inject(),

    actions: {
        authenticate: function () {
            const _this = this;
            const credentials = this.getProperties('username', 'password');
            const authenticator = 'authenticator:token';

            this.session.authenticate(authenticator, credentials)
                .then(() => { },
                    () => {
                        const message = _this.get("intl").t("auth.login.bad.credentials");
                        _this.get("notification").showErrorMessage(message);
                    });
        },

        showForgetPassword: function () {
            this.set("isLoginShown", false);
        },
    }

});

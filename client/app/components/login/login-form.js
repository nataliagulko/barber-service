import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    classNames: ['login-form'],
    session: inject(),

    actions: {
        authenticate: function () {
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'authenticator:token';

            this.get('session').authenticate(authenticator, credentials);
        }
    }

});

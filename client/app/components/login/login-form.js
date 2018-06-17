import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    session: inject(),
    phoneMask: ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],

    actions: {
        authenticate: function () {
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'authenticator:token';

            this.get('session').authenticate(authenticator, credentials);
        }
    }

});

import Component from '@ember/component';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject } from '@ember/service';

export default Component.extend(ApplicationRouteMixin, {
	classNames: ['page-header', 'navbar', 'navbar-fixed-top'],
	session: inject('session'),
	currentUser: inject('current-user-service'),

    actions: {
        invalidateSession: function() {
            this.session.invalidate();
        }
    }
});

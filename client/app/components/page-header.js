import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Component.extend(ApplicationRouteMixin, {
	session: Ember.inject.service('session'),
	classNames: ['page-header', 'navbar', 'navbar-fixed-top'],
	
    actions: {
        invalidateSession: function() {
            this.get('session').invalidate();
        }
    }
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
			service: this.get('store').createRecord('service'),
			serviceToGroup: this.get('store').createRecord('serviceToGroup'),
			// serviceGroup: this.get('store').createRecord('serviceGroup'),
			masters: this.get('store').findAll('master'),
			subservices: this.get('store').findAll('service'),
		});
	},

	actions: {}
});

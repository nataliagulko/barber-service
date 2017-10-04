import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
			service: this.store.createRecord('service'),
			masters: this.get('store').findAll('master'),
			subservices: this.get('store').findAll('service'),
		});
	},

	actions: {}
});

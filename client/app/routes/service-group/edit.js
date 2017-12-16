import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model(params) {
		return Ember.RSVP.hash({
			serviceGroup: this.get('store').findRecord('service-group', params.id),
			masters: this.get('store').findAll('master'),
			subservices: this.get('store').findAll('service'),
		});
	}
});

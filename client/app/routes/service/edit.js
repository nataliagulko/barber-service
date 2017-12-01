import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
		model(params) {
		return Ember.RSVP.hash({
			service: this.get('store').findRecord('service', params.id),
			masters: this.get('store').findAll('master')
		});
	},
});

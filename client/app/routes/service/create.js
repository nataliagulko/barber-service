import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return this.store.createRecord('service');
	},

	actions: {
		save: function(service) {
			console.log('save', service);
			service.save().then(() => this.transitionTo('service'));
		}
	}
});

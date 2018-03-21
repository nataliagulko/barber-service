import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RollbackAttributesMixin from 'barbers/mixins/rollback-attributes-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, RollbackAttributesMixin, {
	model(params) {
		return Ember.RSVP.hash({
			serviceGroup: this.get('store').findRecord('service-group', params.id),
			masters: this.get('store').findAll('master'),
			subservices: this.get('store').findAll('service'),
		});
	},

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.serviceGroup);
	}
});

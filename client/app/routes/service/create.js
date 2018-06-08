import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RollbackAttributesMixin from 'barbers/mixins/rollback-attributes-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, RollbackAttributesMixin, {
	model() {
		const store = this.get('store');

		return Ember.RSVP.hash({
			service: store.createRecord('service'),
			serviceGroup: store.createRecord('serviceGroup'),
			masters: store.findAll('master'),
			subservices: store.query('service', {
				query: {
					onlySimpleService: true
				}
			}),
		});
	},

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.service);
		this.rollback(model.serviceGroup);
	}
});

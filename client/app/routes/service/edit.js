import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RollbackAttributesMixin from 'barbers/mixins/rollback-attributes-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, RollbackAttributesMixin, {
	model(params) {
		return Ember.RSVP.hash({
			service: this.get('store').findRecord('service', params.id),
			masters: this.get('store').findAll('master')
		});
	},

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.service);
	}
});

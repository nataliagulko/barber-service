import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
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

	deactivate: function () {
		this._super(...arguments);

		const model = this.modelFor(this.routeName),
			serviceRecord = model.service,
			serviceGroupRecord = model.serviceGroup;

		serviceRecord.rollbackAttributes();
		serviceGroupRecord.rollbackAttributes();		
	}
});

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		// return this.store.createRecord('service', {
		// 	masters: this.get('store').findAll('master')
		// });
		return this.store.createRecord('master');
	},
});

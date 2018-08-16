import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
	currentUser: inject('current-user-service'),

	_loadCurrentUser() {
		return this.get('currentUser').load()
			.catch(() => { });
	},

	beforeModel() {
		return this._loadCurrentUser();
	},

	sessionAuthenticated() {
		this._super(...arguments);
		this._loadCurrentUser();
	},

	activate() {
		const business = this.get("currentUser").get("business");
		console.log(business.get("id"));

		this.transitionTo("auth");
	}
});

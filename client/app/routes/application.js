import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import $ from 'jquery';
import { inject } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
	currentUser: inject('current-user-service'),

	init() {
		this._super(...arguments);

		$(document)
			.ajaxSend(() => {
				$(".overlay").show();
			}).ajaxComplete(() => {
				$(".overlay").hide();
			});
	},

	beforeModel() {
		return this._loadCurrentUser();
	},

	sessionAuthenticated() {
		this._super(...arguments);
		this._loadCurrentUser();
	},

	_loadCurrentUser() {
		return this.get('currentUser').load()
			.catch(() => {
				// this.get('session').invalidate()
				console.log("e");
			});
	}
});

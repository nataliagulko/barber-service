import Route from '@ember/routing/route';
import $ from 'jquery';
import { inject } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
	currentUserService: inject('current-user-service'),
	notification: inject("notification-service"),

	_loadCurrentUser() {
		const _this = this;
		const currentUserService = _this.get("currentUserService");

		const p = currentUserService.load()
			.then(() => {
				debugger;
				const business = _this.get("currentUserService.master");
				if (business) {
					const code = business.get("firstname")
					_this.transitionTo("auth", code);
				} else {
					_this._invalidate();
				}
			})
			.catch(() => _this._invalidate());

		return p;
	},

	_invalidate() {
		this.get('session').invalidate();
	},

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
});

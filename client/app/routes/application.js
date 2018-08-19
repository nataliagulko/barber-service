import Route from '@ember/routing/route';
import $ from 'jquery';
import { inject } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
	currentUserService: inject('current-user-service'),
	notification: inject("notification-service"),

	_loadCurrentUser() {
		return this.get('currentUserService')
			.load()
			.then(() => {
				const user = this.get("currentUserService").get("user");
				this.get("currentUserService").get("business")
					.then((currentBusiness) => {
						if (currentBusiness) {
							const code = currentBusiness.get("code");
							this.transitionTo("auth", code);
						} else {
							this._invalidate();
						}
					});
			})
			.catch(() => this._invalidate());
	},

	_invalidate() {
		this.get('session').invalidate()
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

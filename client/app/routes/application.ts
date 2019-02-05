import { get } from "@ember/object";
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import ApplicationRouteMixin from "ember-simple-auth/mixins/application-route-mixin";
import $ from "jquery";

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {
	currentUserService = service("current-user-service")
	notification = service("notification-service")
	sessionService = service("session")
	intl = service()

	_loadCurrentUser(this: ApplicationRoute) {
		const route = this;
		const currentUserService = get(route, "currentUserService");

		const p = currentUserService.load()
			.then(() => {
				const business = get(route, "currentUserService").business;
				if (business) {
					const code = get(business, "code") || "nova";
					route.transitionTo("auth", code);
				} else {
					route._invalidate();
				}
			})
			.catch(() => route._invalidate());

		return p;
	}

	_invalidate(this: ApplicationRoute) {
		get(this, "sessionService").invalidate();
	}

	init(this: ApplicationRoute) {
		this._super(...arguments);

		$(document)
			.ajaxSend(() => {
				$(".overlay").show();
			}).ajaxComplete(() => {
				$(".overlay").hide();
			});
	}

	beforeModel(this: ApplicationRoute) {
		get(this, "intl").setLocale("ru");
		return this._loadCurrentUser();
	}

	sessionAuthenticated(this: ApplicationRoute) {
		this._super(...arguments);
		this._loadCurrentUser();
	}
}

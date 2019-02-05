import { classNames } from "@ember-decorators/component";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import ApplicationRouteMixin from "ember-simple-auth/mixins/application-route-mixin";

@classNames("page-header", "navbar", "navbar-fixed-top")
export default class PageHeader extends Component.extend(ApplicationRouteMixin) {
	sessionService = service("session")
	currentUser = service("current-user-service")

	actions = {
		invalidateSession(this: PageHeader) {
			get(this, "sessionService").invalidate()
		},
	}
};

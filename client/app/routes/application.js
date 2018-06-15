import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	routeAfterAuthentication: "authenticated",
	session: Ember.inject.service('session'),

	init() {
		$(document)
			.ajaxSend(() => {
				Ember.$(".overlay").show();
			}).ajaxComplete(() => {
				Ember.$(".overlay").hide();
			});
	}
});

import Route from '@ember/routing/route';
import $ from 'jquery';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
	init() {
		this._super(...arguments);

		$(document)
			.ajaxSend(() => {
				$(".overlay").show();
			}).ajaxComplete(() => {
				$(".overlay").hide();
			});
	},
});

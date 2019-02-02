declare module 'ember-simple-auth/mixins/application-route-mixin' {
	import Mixin from '@ember/object/mixin';

	interface ApplicationRoute {
		authorizer: string | null;
	}

	const ApplicationRouteMixin: Mixin<ApplicationRoute>;

	export default ApplicationRouteMixin;
}

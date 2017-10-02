import Ember from 'ember';
import AuthentcatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Component.extend({
	actions: {
		saveMaster: function() {
			this.get("master")
				.save();
		}
	}
});

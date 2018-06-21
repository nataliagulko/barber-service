import Component from '@ember/component';

export default Component.extend({
	classNames: ["login"],
	isLoginShown: true,

	actions: {
		showLogin: function() {
			this.set("isLoginShown", true);
		}
	}
});

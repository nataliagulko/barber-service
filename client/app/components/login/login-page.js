import Component from '@ember/component';

export default Component.extend({
	classNames: ["login"],
    phoneMask: ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
	isLoginShown: true,

	actions: {

		showLogin: function() {
			this.set("isLoginShown", true);
		}
	}
});

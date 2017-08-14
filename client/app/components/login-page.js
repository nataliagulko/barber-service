import Ember from 'ember';

export default Ember.Component.extend({
	classNames: "login",

	didInsertElement: function() {
		$(".login").backstretch([
			"/img/bg/1.jpg",
			"/img/bg/2.jpg",
			"/img/bg/3.jpg",
			"/img/bg/4.jpg"
		], {
			fade: 1000,
			duration: 8000
		});
	}
});

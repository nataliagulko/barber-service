import Ember from 'ember';

export default Ember.Service.extend({

	init() {
		var $input = $('.timepicker').pickatime({
			clear: "Очистить",
			closeOnSelect: false,
			closeOnClear: false,
			format: "HH:i",
			formatSubmit: 'HH:i',
		});
		var picker = $input.pickatime('picker');

		picker.$node.addClass('picker__input--active picker__input--target');
		picker.$node.attr('aria-expanded', 'true');
		picker.$root.addClass('picker--focused picker--opened');
		picker.$root.attr('aria-hidden', 'false');
	},

	set(selector, func, params) {
		var picker = $(selector).pickatime('picker');
		picker.set(func, params);
	},

	on(selector, method, callback) {
		var picker = $(selector).pickatime('picker');
		picker.on(method, callback);
	}
});

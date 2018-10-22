import Service from '@ember/service';

export default Service.extend({

	init() {
		this._super(...arguments);
		var $input = $('.timepicker').pickatime({
			clear: "Очистить",
			closeOnSelect: false,
			closeOnClear: false,
			format: "HH:i",
			formatSubmit: 'HH:i',
			interval: 10
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
	},
	
	stop(selector) {
		var picker = $(selector).pickatime('picker');
		picker.stop();
	},
	
	render(selector) {
		var picker = $(selector).pickatime('picker');
		picker.render();
	}
});

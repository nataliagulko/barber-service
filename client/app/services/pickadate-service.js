import Service from '@ember/service';

export default Service.extend({

	init() {
		this._super(...arguments);
		var $input = $('.datepicker').pickadate({
			closeOnSelect: false,
			closeOnClear: false,
			format: "dd.mm.yyyy",
			formatSubmit: "dd.mm.yyyy",			
		});
		var picker = $input.pickadate('picker');

		picker.$node.addClass('picker__input--active picker__input--target');
		picker.$node.attr('aria-expanded', 'true');
		picker.$root.addClass('picker--focused picker--opened');
		picker.$root.attr('aria-hidden', 'false');
	},

	set(selector, method, params) {
		var picker = $(selector).pickadate('picker');
		picker.set(method, params);
	},

	on(selector, method, callback) {
		var picker = $(selector).pickadate('picker');
		picker.on(method, callback);
	}
});

import Ember from 'ember';

export default Ember.Service.extend({

	init() {
		var $input = $('.datepicker').pickadate({
			closeOnSelect: false,
			closeOnClear: false,
		});
		var picker = $input.pickadate('picker');

		picker.$node.addClass('picker__input--active picker__input--target');
		picker.$node.attr('aria-expanded', 'true');
		picker.$root.addClass('picker--focused picker--opened');
		picker.$root.attr('aria-hidden', 'false');
	}
});

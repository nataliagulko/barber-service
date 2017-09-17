import Ember from 'ember';

export default Ember.Service.extend({

	init() {
		var $input = $('.timepicker').pickatime({
			closeOnSelect: false,
			closeOnClear: false,
		});
		var picker = $input.pickatime('picker');

		picker.$node.addClass('picker__input--active picker__input--target');
		picker.$node.attr('aria-expanded', 'true');
		picker.$root.addClass('picker--focused picker--opened');
		picker.$root.attr('aria-hidden', 'false');
	}
});

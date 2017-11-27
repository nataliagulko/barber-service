import Ember from 'ember';

export default Ember.Service.extend({
	initSelect2() {
		$(".select2").select2({
			width: '.form-control'
		});
	}
});

import Ember from 'ember';

export default Ember.Service.extend({
	init() {
		$(".select2").select2();
	}
});

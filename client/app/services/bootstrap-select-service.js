import Ember from 'ember';

export default Ember.Service.extend({
	initSelectpicker(selector) {
		$(selector).selectpicker();
	}
});

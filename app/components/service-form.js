import Ember from 'ember';

export default Ember.Component.extend({
	validate: Ember.inject.service(),

	didInsertElement: function() {
		var validate = this.get('validate'),
			options = {
				rules: {
					name: 'required',
					cost: 'required',
					time: 'required',
					masters: 'required'
				}
			};

		validate.validateForm('#service-form', options);
	},
});
